import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

// CONFIGURATION
const LOCAL_API = 'http://127.0.0.1:1337/api/articles';
const CLOUD_API = 'https://effortless-bouquet-6d3238b852.strapiapp.com/api/articles';
const CLOUD_UPLOAD_API = 'https://effortless-bouquet-6d3238b852.strapiapp.com/api/upload';
const CLOUD_API_TOKEN = '15305cd642a5ef3cd4398d7e01acb6f08dd9157e0c60c98c209827ecbc1369659cdf8366a8715fa8be58c810a357311bf972f6ebe2e80ee17567ddf09f5fdd4717c809431ac3c538bf207b3f0024a6b36211b5dae4ad2f48940740a844e0f545d0765a201dc382235febf49e853e093e15101a931b345f8c574fc518fea3f626';



async function fetchLocalArticles() {
  const res = await axios.get(LOCAL_API);
  return res.data.data;
}

async function downloadImage(url, filename) {
  const res = await axios.get(url, { responseType: 'stream' });
  const filePath = path.join('./', filename);
  await new Promise((resolve, reject) => {
    const stream = res.data.pipe(fs.createWriteStream(filePath));
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
  return filePath;
}

async function uploadImageToCloud(filePath) {
  const form = new FormData();
  form.append('files', fs.createReadStream(filePath));
  const res = await axios.post(CLOUD_UPLOAD_API, form, {
    headers: {
      ...form.getHeaders(),
      Authorization: `Bearer ${CLOUD_API_TOKEN}`,
    },
  });
  return res.data[0]; // Returns uploaded file object
}

async function getCloudArticleBySlug(slug) {
  const res = await axios.get(`${CLOUD_API}?filters[slug][$eq]=${slug}`,
    { headers: { Authorization: `Bearer ${CLOUD_API_TOKEN}` } });
  return res.data.data[0];
}

async function createOrUpdateCloudArticle(article, coverImageId, existingId) {
  const data = { ...article, coverImage: coverImageId || null };
  console.log('\n--- Syncing Article ---');
  console.log('ID for update:', existingId);
  console.log('Outgoing data:', JSON.stringify(data, null, 2));
  try {
    if (existingId) {
      // Update if any ID (string or number)
      const res = await axios.put(
        `${CLOUD_API}/${existingId}`,
        { data },
        { headers: { Authorization: `Bearer ${CLOUD_API_TOKEN}` } }
      );
      return res.data;
    } else {
      // Create new article if no valid existing ID
      const res = await axios.post(
        CLOUD_API,
        { data },
        { headers: { Authorization: `Bearer ${CLOUD_API_TOKEN}` } }
      );
      return res.data;
    }
  } catch (err) {
    console.error('Request failed:', err?.response?.data || err.message);
    throw err;
  }
}

function getImageUrl(attrs) {
  if (attrs.coverImage && Array.isArray(attrs.coverImage) && attrs.coverImage.length > 0) {
    const img = attrs.coverImage[0];
    return img.url.startsWith('http') ? img.url : `http://localhost:1337${img.url}`;
  }
  return null;
}

function cleanArticleForCloud(attrs) {
  return {
    title: attrs.title,
    content: attrs.content,
    categories: attrs.categories,
    slug: attrs.slug,
    readTime: attrs.readTime,
    publishDate: attrs.publishDate,
    smParagraph: attrs.smParagraph,
  };
}

async function main() {
  const localArticles = await fetchLocalArticles();
  for (const item of localArticles) {
    const attrs = item;
    const article = cleanArticleForCloud(attrs);
    let coverImageId = null;
    const imageUrl = getImageUrl(attrs);
    let tempFile = null;
    if (imageUrl) {
      try {
        const filename = `temp_${attrs.slug || attrs.title.replace(/\s+/g, '_')}.jpg`;
        tempFile = await downloadImage(imageUrl, filename);
        const uploaded = await uploadImageToCloud(tempFile);
        coverImageId = uploaded.id;
        fs.unlinkSync(tempFile); // Clean up temp file
      } catch (e) {
        console.error('Image upload failed for', attrs.title, e.message);
      }
    }
    // Check for existing article by slug
    let existing = null;
    try {
      existing = await getCloudArticleBySlug(attrs.slug);
    } catch (e) {
      // ignore
    }
    try {
      const result = await createOrUpdateCloudArticle(article, coverImageId, existing?.id);
      if (result) {
        console.log(existing ? 'Updated:' : 'Synced:', article.title);
      }
    } catch (err) {
      console.error('Failed to sync article:', article.title, err.response?.data || err.message);
    }
  }
}

main();
