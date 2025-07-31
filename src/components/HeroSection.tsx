import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import bg from "../assets/bg/GreenFitness.png";

const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 bg-[#212121] bg-gradient-to-r from-[#212121] to-[#2a2a2a]">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt="Fitness Background"
          className="w-full h-full object-cover opacity-30 z-0"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Level Up Your Fitness with
            <span className="block text-[#cfff6a]">Fitness Hub</span>
          </h1>
        </div>

        <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Your all-in-one destination for effective workouts, clean eating plans, and real-world tips
          to build strength, burn fat, and stay motivated — no matter your level.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/begin"
            className="bg-[#cfff6a] text-[#212121] px-8 py-3 rounded-lg font-semibold text-lg transition hover:brightness-110 flex items-center gap-2"
          >
            Start Your Journey
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/workouts"
            className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 px-8 py-3 rounded-lg font-medium transition text-lg"
          >
            Browse Workouts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
