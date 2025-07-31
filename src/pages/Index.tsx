import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BlogSection from '@/components/Blogs';
import CategorySection from '@/components/CategorySection';
import EmailSection from '@/components/EmailSection';


import Footer from '@/components/Footer';

const Index = () => {

  return (
  <div className="min-h-screen bg-[#212121] text-white">
    <Header />
    <HeroSection />

    {/* Featured Posts Section */}
    <BlogSection />

    {/* Categories Section */}
    <CategorySection />

    {/* Newsletter Section */}
    <EmailSection />

    <Footer />
  </div>
);

};

export default Index;