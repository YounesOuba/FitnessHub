import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Loader2 } from 'lucide-react';
import { getAllPosts } from '@/data/blogPosts';
import type { BlogPost } from '@/data/blogPosts';
import { getRandomBackground } from '@/lib/utils';

export default function BeginnerGuidePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImage] = useState(getRandomBackground());

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const allPosts = await getAllPosts();
        const beginnerPosts = allPosts.filter(post => 
          post.categories.includes('beginner')
        );
        setPosts(beginnerPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#212121]">
      <Header />
      <main className="py-16">
        <div className="mx-auto -mt-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full mx-auto py-72 text-center mb-12 relative bg-[#212121]/40 p-8 rounded-2xl backdrop-blur-sm overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
              <img
                src={backgroundImage}
                alt="Fitness Background"
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Begin Your Fitness Journey
              <span className="block text-[#cfff6a] text-2xl mt-2">
                {posts.length} {posts.length === 1 ? 'Guide' : 'Guides'}
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Start your fitness journey with our carefully curated beginner-friendly guides.
              Learn the basics, build good habits, and progress at your own pace.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#cfff6a]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
