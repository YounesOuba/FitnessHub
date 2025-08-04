import { CategoryLabel } from '@/lib/constants';
import axios from 'axios';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  fullContent: string;
  readTime: string;
  image: string;
  categories: CategoryLabel[];
  href: string;
  publishedAt?: string;
}

const CLOUD_API = 'https://effortless-bouquet-6d3238b852.strapiapp.com/api/articles?populate=*';
const CLOUD_API_TOKEN = '15305cd642a5ef3cd4398d7e01acb6f08dd9157e0c60c98c209827ecbc1369659cdf8366a8715fa8be58c810a357311bf972f6ebe2e80ee17567ddf09f5fdd4717c809431ac3c538bf207b3f0024a6b36211b5dae4ad2f48940740a844e0f545d0765a201dc382235febf49e853e093e15101a931b345f8c574fc518fea3f626';

export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    console.log('Fetching posts from:', CLOUD_API);
    const res = await axios.get(CLOUD_API, {
      headers: {
        Authorization: `Bearer ${CLOUD_API_TOKEN}`,
      },
    });
    console.log('API Response:', res.data);
    let posts = res.data.data;
    // If not Strapi v4 format, try to use the response directly (flat array)
    if (!posts && Array.isArray(res.data)) {
      posts = res.data;
    }
    if (!posts || posts.length === 0) {
      console.error('No posts returned from API');
      return [];
    }
    console.log('Raw posts from API:', posts);

    const mappedPosts = posts.map((item: any) => {
      // Support both Strapi v4 (attributes) and flat format
      const attrs = item.attributes || item;

      // Defensive check for coverImage
      let imageUrl = '';
      if (attrs.coverImage) {
        // Strapi v4: coverImage.data
        if (attrs.coverImage.data) {
          if (Array.isArray(attrs.coverImage.data)) {
            const img = attrs.coverImage.data[0]?.attributes;
            if (img && img.url) {
              imageUrl = img.url.startsWith('http') ? img.url : `https://effortless-bouquet-6d3238b852.strapiapp.com${img.url}`;
            }
          } else if (attrs.coverImage.data.attributes) {
            const img = attrs.coverImage.data.attributes;
            if (img && img.url) {
              imageUrl = img.url.startsWith('http') ? img.url : `https://effortless-bouquet-6d3238b852.strapiapp.com${img.url}`;
            }
          }
        } else if (Array.isArray(attrs.coverImage) && attrs.coverImage.length > 0) {
          // Flat format: coverImage is array of objects with url
          const img = attrs.coverImage[0];
          if (img && img.url) {
            imageUrl = img.url.startsWith('http') ? img.url : `https://effortless-bouquet-6d3238b852.strapiapp.com${img.url}`;
          }
        }
      }

      // Handle content
      let contentString = '';
      if (typeof attrs.content === 'string') {
        contentString = attrs.content;
      } else if (Array.isArray(attrs.content)) {
        // Strapi v4 or custom block format: array of blocks
        contentString = attrs.content.map((block: any) => {
          if (block.type === 'paragraph' && Array.isArray(block.children)) {
            const text = block.children.map((child: any) => child.text).join('');
            return `<p>${text}</p>`;
          }
          // Add more block types as needed (e.g., heading, list, etc.)
          return '';
        }).join('\n');
      } else if (attrs.content && attrs.content.blocks) {
        // Editor.js or similar format
        contentString = attrs.content.blocks.map((block: any) => {
          if (block.type === 'paragraph' && block.children) {
            return block.children.map((child: any) => child.text).join('');
          }
          return '';
        }).join('\n\n');
      }

      // Categories
      let categoriesArr: string[] = [];
      if (attrs.categories) {
        if (Array.isArray(attrs.categories.data)) {
          // Strapi v4 relation
          categoriesArr = attrs.categories.data.map((cat: any) => cat.attributes?.name).filter(Boolean);
        } else if (typeof attrs.categories === 'string') {
          // Flat format: comma-separated string
          categoriesArr = attrs.categories.split(',').map((c: string) => c.trim());
        }
      }

      // Debug the attributes we're getting
      console.log('Processing item:', {
        id: item.id,
        title: attrs.title,
        slug: attrs.slug,
        attributes: attrs
      });

      const href = attrs.slug ? `${attrs.slug}` : '';
      console.log('Generated href:', href);

      return {
        id: String(item.id),
        title: attrs.title || '',
        content: contentString,
        fullContent: contentString,
        readTime: attrs.readTime || '',
        image: imageUrl,
        categories: categoriesArr,
        href: href,
        publishedAt: attrs.publishedAt || attrs.publishDate || attrs.createdAt || '',
      };
    });

    const filteredPosts = mappedPosts.filter((post: BlogPost) => !!post.href && post.href.trim() !== '');
    console.log('Filtered posts with valid href:', filteredPosts);
    return filteredPosts;

  } catch (err) {
    console.error('Failed to fetch posts from Strapi Cloud:', err);
    return [];
  }
};