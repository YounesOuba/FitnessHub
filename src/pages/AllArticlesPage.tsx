import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getAllPosts } from '@/data/blogPosts';
import type { BlogPost } from '@/data/blogPosts';
import { getRandomBackground } from '@/lib/utils';

export default function AllArticlesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [backgroundImage] = useState(getRandomBackground());
  const postsPerPage = 9;

  useEffect(() => {

    window.scrollTo(0, 0);

    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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
              All Articles
              <span className="block text-[#cfff6a] text-2xl mt-2">
                {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover our complete collection of fitness articles, workouts, and wellness tips.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-[#cfff6a]" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-[#cfff6a] text-[#cfff6a] hover:bg-[#cfff6a] hover:text-black"
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className={pageNum === currentPage 
                        ? "bg-[#cfff6a] text-black hover:bg-[#b6e85a]"
                        : "border-[#cfff6a] text-[#cfff6a] hover:bg-[#cfff6a] hover:text-black"
                      }
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-[#cfff6a] text-[#cfff6a] hover:bg-[#cfff6a] hover:text-black"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
