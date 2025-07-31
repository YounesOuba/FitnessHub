import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BlogPost, getAllPosts } from '@/data/blogPosts';
import { Loader2, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';


export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);

  // Fetch main post and reset state on slug change
  useEffect(() => {
    setPost(null);
    setIsLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchPost = async () => {
      if (!slug) {
        setError('No article specified');
        setIsLoading(false);
        return;
      }

      try {
        const posts = await getAllPosts();
        // Normalize slug for comparison
        const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
        const foundPost = posts.find(p => {
          const normalizedHref = p.href.replace(/^\/+|\/+$/g, '');
          return normalizedHref === normalizedSlug;
        });

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Failed to load post:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Fetch related articles
  useEffect(() => {
    const fetchRelatedArticles = async () => {
      if (!post?.categories?.length) return;

      try {
        const posts = await getAllPosts();
        const relatedPosts = posts
          .filter(p => 
            p.id !== post.id && 
            p.categories.some(cat => post.categories.includes(cat))
          )
          .slice(0, 3);
        setRelated(relatedPosts);
      } catch (err) {
        console.error('Failed to fetch related articles:', err);
        setRelated([]);
      }
    };

    fetchRelatedArticles();
  }, [post]);

  // Fetch recent posts (latest 5)
  useEffect(() => {
    getAllPosts().then(posts => {
      const sorted = [...posts].sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
      setRecentPosts(sorted.slice(0, 5));
    });
  }, []);

  // Fetch comments from Supabase when post is loaded
  useEffect(() => {
    if (!slug) return;
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('article_slug', slug);
      if (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } else if (data) {
        console.log('Fetched comments:', data);
        setComments(data);
      } else {
        setComments([]);
      }
    };
    fetchComments();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-[#cfff6a]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#cfff6a]">{error || 'Article not found'}</h2>
            <Button asChild variant="ghost" className="text-[#cfff6a] hover:text-[#b6e85a] hover:bg-[#333333]">
              <Link to="/articles">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <article className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Button 
              asChild 
              variant="ghost" 
              className="mb-6 text-[#cfff6a] hover:text-[#b6e85a] hover:bg-[#333333]"
            >
              <Link to="/articles">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Link>
            </Button>

            <div className="mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-lg mb-6"
              />
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#cfff6a]">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="bg-[#cfff6a] text-black px-3 py-1 text-xs sm:text-sm font-semibold rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="prose prose-invert prose-green max-w-none">
                {post.fullContent ? (
                  <div dangerouslySetInnerHTML={{ __html: post.fullContent }} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
            </div>
            {/* Comments Section */}
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4 text-[#cfff6a]">Comments</h3>
              <form
                onSubmit={async e => {
                  e.preventDefault();
                  if (commentText.trim()) {
                    console.log('Attempting to add comment for slug:', slug);
                    const newComment = {
                      article_slug: slug,
                      text: commentText,
                      date: new Date().toLocaleString(),
                    };
                    console.log('New comment data:', newComment);
                    const { data, error } = await supabase
                      .from('comments')
                      .insert([newComment])
                      .select();
                    if (error) {
                      console.error('Error adding comment:', error);
                      alert('Failed to add comment. Please try again.');
                    } else if (data) {
                      console.log('Successfully added comment:', data);
                      setComments([...comments, ...data]);
                      setCommentText('');
                    } else {
                      console.error('No data returned after insert');
                      alert('Failed to add comment. Please try again.');
                    }
                  }
                }}
                className="flex gap-2 mb-4"
              >
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#cfff6a] text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#cfff6a]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-medium text-black bg-[#cfff6a] hover:bg-[#b6e85a]"
                >
                  Post
                </button>
              </form>
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <p className="text-white/70">No comments yet.</p>
                ) : (
                  comments.map((c, i) => (
                    <div key={c.id || i} className="bg-[#1a1a1a] p-3 rounded-lg">
                      <p className="text-white/80">{c.text}</p>
                      <span className="text-xs text-white/40">{c.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Sidebar with Related Articles, Categories, and Recent Posts */}
          <div className="mt-[62px] lg:w-80">
            <div className="bg-[#1a1a1a] p-6 rounded-xl sticky top-6">
              <h2 className="text-xl font-semibold text-[#cfff6a] mb-4">Related Articles</h2>
              <div className="space-y-4">
                {related.length > 0 ? (
                  related.map((article) => (
                    <Link
                      key={article.id}
                      to={article.href.startsWith('/') ? article.href : `/article/${article.href.replace(/^\/+/,'')}`}
                      className="block group"
                    >
                      <div className="bg-[#212121] rounded-lg overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-[#cfff6a]">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-white group-hover:text-[#cfff6a] transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-white/70 mt-2">{article.readTime}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-white/70 text-sm">No related articles found</p>
                )}
              </div>
              {/* Labels/Categories Section under related posts */}
              <div className="mt-8">
                <h4 className="text-base font-semibold mb-3 text-[#CFFF6A]">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {[{ label: 'Home Workouts', href: '/category/home-workouts' },
                    { label: 'Gym Workouts', href: '/category/gym-workouts' },
                    { label: 'Beginner', href: '/category/beginner' },
                    { label: 'Fat Burning', href: '/category/fat-burning' },
                    { label: 'Meal Plans', href: '/category/meal-plans' },
                    { label: 'Recipes', href: '/category/recipes' },
                    { label: 'Supplements', href: '/category/supplements' }].map((cat) => (
                    <Link
                      key={cat.href}
                      to={cat.href}
                      className="bg-[#cfff6a] text-black px-3 py-1 text-xs font-semibold rounded-full hover:bg-[#b6e85a] transition"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Recent Posts Section */}
              <div className="mt-8">
                <h4 className="text-base font-semibold mb-3 text-[#CFFF6A]">Recent Posts</h4>
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
                          <p className="text-xs text-white/70 mt-1">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};