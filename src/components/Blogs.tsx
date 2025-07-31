
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getAllPosts } from '@/data/blogPosts';
import type { BlogPost } from '@/data/blogPosts';
import type { CategoryLabel } from '@/lib/constants';



function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  
  const categoryParam = new URLSearchParams(location.search).get('category');
  const selectedCategories = categoryParam ? categoryParam.split(',') as CategoryLabel[] : null;

  useEffect(() => {
    const loadInitialPosts = async () => {
      setIsLoading(true);
      try {
        const allPosts = await getAllPosts();
        const filteredPosts = selectedCategories 
          ? allPosts.filter(post => 
              selectedCategories.some(category => post.categories.includes(category))
            )
          : allPosts;
        setPosts(filteredPosts);
        setVisiblePosts(3); // Reset visible posts when category changes
        setHasMore(filteredPosts.length > 3);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialPosts();
  }, []);

    return(
    <section className="py-16 bg-[#212121] text-white">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#cfff6a]">
            Latest Fitness & Wellness Content
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover expert tips, workout routines, and nutrition advice to help you 
            achieve your health and fitness goals.
          </p>
        </div>

        {isLoading && posts.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#cfff6a]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, visiblePosts).map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <Button
              onClick={async () => {
                setIsLoading(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                const nextCount = visiblePosts + 3;
                setVisiblePosts(nextCount);
                setHasMore(posts.length > nextCount);
                setIsLoading(false);
              }}
              className="bg-[#cfff6a] text-[#212121] hover:bg-[#b6e85a] px-6 py-3 rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                `Show More Articles (${visiblePosts}/${posts.length})`
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
    )
}



export default BlogSection;