import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllPosts } from '@/data/blogPosts';
import PostCard from '@/components/PostCard';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/data/blogPosts';
import { CategoryLabel } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { getRandomBackground } from '@/lib/utils';

// Define category details mapping
const categoryDetailsMap = {
  'home-workouts': {
    name: 'Home Workouts',
    description: 'Effective workouts you can do from the comfort of your home'
  },
  'gym-workouts': {
    name: 'Gym Workouts',
    description: 'Professional workout routines for gym enthusiasts'
  },
  'beginner': {
    name: 'Beginner Friendly',
    description: 'Start your fitness journey with beginner-friendly content'
  },
  'fat-burning': {
    name: 'Fat Burning',
    description: 'High-intensity workouts designed for maximum fat burning'
  },
  'meal-plans': {
    name: 'Meal Plans',
    description: 'Structured meal plans to support your fitness goals'
  },
  'recipes': {
    name: 'Healthy Recipes',
    description: 'Nutritious and delicious recipes for a healthy lifestyle'
  },
  'supplements': {
    name: 'Supplements',
    description: 'Essential guides and information about effective supplements'
  }
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImage] = useState(getRandomBackground());
  const [search, setSearch] = useState('');

  const categoryDetails = category ? categoryDetailsMap[category] : null;

  useEffect(() => {
    // Scroll to top when category changes
    window.scrollTo(0, 0);
    
    const loadCategoryPosts = async () => {
      setIsLoading(true);
      try {
        const allPosts = await getAllPosts();
        // Filter posts that match the category or have it in their tags array
        const filteredPosts = allPosts.filter(post => 
          post.categories.includes(category as CategoryLabel)
        );
        setPosts(filteredPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      loadCategoryPosts();
    }
  }, [category]);

  // Filter posts by search
  const filteredPosts = search.trim()
    ? posts.filter(
        p => p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  // Recent posts (latest 5)
  const recentPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
  <div className="min-h-screen bg-[#212121] relative">
    {/* Content */}
    <div className="relative z-10">
      <Header />
      
      <section className="py-20">
        <div className="mx-auto px-4 -mt-20 sm:px-6 lg:px-8">
          <div className="w-full max-h-full py-72 mx-auto text-center mb-16 relative bg-[#212121]/40 p-8 rounded-2xl backdrop-blur-sm">
          {/* Background Image */}
            <div className="absolute inset-0 w-full h-full -z-10">
              <img
                src={backgroundImage}
                alt="Fitness Background"
                className="w-full h-full object-cover opacity-15"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {categoryDetails?.name || 'Category Not Found'}
              <span className="block text-[#cfff6a] text-2xl mt-2">
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </h1>
            <p className="text-xl text-white/70">
              {categoryDetails?.description || 'Category not found. Please check the URL and try again.'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-8 flex items-center gap-4">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#cfff6a] text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#cfff6a]"
                />
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-[#212121] rounded-lg h-64" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="col-span-full text-center text-white/70 py-12">
                      No articles found in this category yet.
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Recent Posts Sidebar */}
            <aside className="lg:w-80">
              <div className="bg-[#1a1a1a] p-6 rounded-xl sticky top-6">
                <h2 className="text-xl font-semibold text-[#cfff6a] mb-4">Recent Posts</h2>
                <div className="space-y-4">
                  {recentPosts.map(post => (
                    <Link
                      key={post.id}
                      to={post.href.startsWith('/') ? post.href : `/article/${post.href.replace(/^\/+/,'')}`}
                      className="block group"
                    >
                      <div className="bg-[#212121] rounded-lg overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-[#cfff6a]">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-20 object-cover"
                        />
                        <div className="p-2">
                          <h3 className="font-semibold text-white group-hover:text-[#cfff6a] transition-colors line-clamp-2 text-sm">
                            {post.title}
                          </h3>
                          <p className="text-xs text-white/70 mt-1">{post.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
);
};

export default CategoryPage;
