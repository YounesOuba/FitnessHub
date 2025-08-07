import { Facebook, Twitter, Instagram, Linkedin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const blogURL = encodeURIComponent('https://www.fitnesshubguide.com');
const shareText = encodeURIComponent('Check out this awesome fitness blog! 💪');

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    href: `https://www.facebook.com/sharer/sharer.php?u=${blogURL}`,
    colorClass: 'hover:bg-[#1877F2]', // Facebook blue
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: `https://twitter.com/intent/tweet?url=${blogURL}&text=${shareText}`,
    colorClass: 'hover:bg-[#1DA1F2]', // Twitter blue
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: `https://www.linkedin.com/shareArticle?mini=true&url=${blogURL}&title=${shareText}`,
    colorClass: 'hover:bg-[#0A66C2]', // LinkedIn blue
  },
  {
    name: 'WhatsApp',
    icon: () => (
      <svg
        className="h-5 w-5 text-white font-bold"
        fill="currentColor"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.82.737 5.577 2.133 7.992L0 32l8.268-2.133A15.894 15.894 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.6c-2.574 0-5.083-.674-7.287-1.951l-.52-.3-4.902 1.265 1.295-4.774-.337-.55C2.746 21.16 2 18.627 2 16 2 8.832 8.832 2 16 2s14 6.832 14 14-6.832 14-14 14zm8.271-9.908c-.452-.226-2.673-1.32-3.088-1.47-.414-.15-.715-.226-1.017.227s-1.17 1.47-1.434 1.77c-.263.3-.525.338-.977.113-.452-.226-1.908-.704-3.635-2.245-1.344-1.2-2.25-2.682-2.515-3.135-.263-.452-.028-.696.198-.921.204-.203.452-.527.678-.79.226-.263.3-.45.452-.752.15-.3.075-.563-.038-.79-.113-.226-1.017-2.45-1.393-3.352-.368-.887-.742-.765-1.017-.765-.263-.012-.563-.015-.864-.015-.3 0-.788.113-1.2.563-.413.45-1.575 1.538-1.575 3.75 0 2.213 1.613 4.353 1.837 4.65.226.3 3.183 4.88 7.706 6.622.51.219.907.35 1.218.45.512.162.977.139 1.345.084.41-.061 1.26-.515 1.44-1.015.176-.5.176-.926.123-1.015-.052-.089-.204-.139-.428-.239z" />
      </svg>
    ),
    href: `https://api.whatsapp.com/send?text=${shareText}%20${blogURL}`,
    colorClass: 'hover:bg-[#25D366]', // WhatsApp green
  },
];


// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Begin Your Journey', href: '/begin' },
    { name: 'Workouts', href: '/workouts' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Categories for labels section
  const categories = [
    { label: 'Home Workouts', href: '/category/home-workouts' },
    { label: 'Gym Workouts', href: '/category/gym-workouts' },
    { label: 'Beginner', href: '/category/beginner' },
    { label: 'Fat Burning', href: '/category/fat-burning' },
    { label: 'Meal Plans', href: '/category/meal-plans' },
    { label: 'Recipes', href: '/category/recipes' },
    { label: 'Supplements', href: '/category/supplements' },
  ];

  return (
    <footer className="bg-[#212121] text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="text-2xl font-bold mb-4" style={{ color: '#CFFF6A' }}>
              Fitness Hub
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Your ultimate destination for fitness inspiration, expert workout guides, 
              nutrition advice, and wellness tips. Transform your lifestyle and achieve 
              your health goals with our comprehensive resources.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-white/10 transition duration-300 ${social.colorClass}`}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-white/80 hover:text-[#CFFF6A] transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-white/80 mb-4">
              Get the latest fitness tips and workout plans delivered to your inbox.
            </p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              // Validate email
              if (!email || !emailRegex.test(email)) {
                toast({
                  variant: "destructive",
                  description: (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Please enter a valid email address.</span>
                    </div>
                  ),
                  duration: 5000,
                });
                return;
              }

              setIsLoading(true);

              try {
                // First, create the table if it doesn't exist
                const { error: createTableError } = await supabase.rpc('create_subscribers_table');
                
                if (createTableError && !createTableError.message.includes('already exists')) {
                  console.error('Error creating table:', createTableError);
                  throw new Error('Failed to initialize subscription system');
                }

                // Check if email already exists
                const { data: existingEmails, error: checkError } = await supabase
                  .from('subscribers')
                  .select('email')
                  .eq('email', email);

                if (checkError) {
                  console.error('Error checking email:', checkError);
                  throw new Error('Failed to verify email');
                }

                if (existingEmails && existingEmails.length > 0) {
                  toast({
                    variant: "destructive",
                    description: (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span>This email is already subscribed.</span>
                      </div>
                    ),
                    duration: 5000,
                  });
                  return;
                }

                // Insert new subscriber
                const { error: insertError } = await supabase
                  .from('subscribers')
                  .insert([{ 
                    email, 
                    subscribed_at: new Date().toISOString()
                  }]);

                if (insertError) {
                  console.error('Error inserting subscriber:', insertError);
                  throw new Error('Failed to add subscription');
                }

                toast({
                  description: (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Successfully subscribed! Check your email.</span>
                    </div>
                  ),
                  duration: 5000,
                });
                setEmail('');
              } catch (error) {
                console.error('Subscription error:', error);
                toast({
                  variant: "destructive",
                  description: (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {error instanceof Error ? error.message : 'Subscription failed. Try again later.'}
                      </span>
                    </div>
                  ),
                  duration: 5000,
                });
              } finally {
                setIsLoading(false);
              }
            }} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#CFFF6A] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg font-medium text-black flex items-center justify-center min-w-[120px]"
                style={{ backgroundColor: '#CFFF6A' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>...</span>
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Labels/Categories Section */}
        <div className="mt-10 pt-8 border-t border-white/20 text-center">
          <h4 className="text-lg font-semibold mb-4 text-[#CFFF6A]">Categories</h4>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                to={cat.href}
                className="bg-[#cfff6a] text-black px-3 py-1 text-xs font-semibold rounded-full hover:bg-[#b6e85a] transition"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <p className="text-white/80">
            © {new Date().getFullYear()} Fitness Hub Blog. All rights reserved. 
            Designed for fitness enthusiasts worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
