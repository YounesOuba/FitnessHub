import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Add Link import

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // ✅ Add dependency array to run once on mount

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-[#212121]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              About <span className="text-[#cfff6a]">Fitness Hub</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              We're on a mission to make fitness accessible, enjoyable, and effective for everyone. 
              Our team of expert trainers and nutritionists are here to guide you on your journey to a healthier lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[700px] mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Mission</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                At Fitness Hub, we believe that everyone deserves access to high-quality fitness information 
                and guidance. We're committed to cutting through the noise and providing science-backed, 
                practical advice that actually works in the real world.
              </p>
              <p className="mb-4">
                Whether you're just starting your fitness journey or looking to take your training to 
                the next level, we're here to support you with expert advice, proven workout plans, 
                and nutritional guidance tailored to your goals.
              </p>
              <p>
                Our content is created by certified fitness professionals and regularly updated to 
                reflect the latest research and best practices in health and fitness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[700px] mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions or want to learn more about our programs? We're here to help!
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-[#cfff6a] text-[#212121] font-semibold hover:brightness-110 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
