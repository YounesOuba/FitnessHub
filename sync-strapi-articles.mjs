import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

// CONFIGURATION
const LOCAL_API = 'http://localhost:1337/api/articles?populate=*';
const CLOUD_API = 'https://smart-wisdom-29d5c859da.strapiapp.com/api/articles';
const CLOUD_UPLOAD_API = 'https://smart-wisdom-29d5c859da.strapiapp.com/api/upload';
const CLOUD_API_TOKEN = '4e90f064f62b4476dd9ed52420affa4c72d99efb317e8734cc5713300ca617713458bfd0cfc3b4c6677f2cd5fe982a777ebb5f49c38456d102f5290cc84da5cdc0c4c2344c39e0dbb3a94c6a06465dcdb5660c2ea6f1a7c11a8fa173adf8a602343d8546c0feb1ea422641cdf0363240f19ff9657a201123e5e84ff01743bac6';

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
    // Add other fields as needed
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
