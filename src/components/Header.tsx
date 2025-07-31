import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from "../assets/Logo/HUB.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { CATEGORIES } from '@/lib/constants';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    navigate(`/category/${label}`);
  };

  return (
    <header className="bg-[#212121] border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex w-auto items-center group">
            <img
              src={Logo}
              alt="Fitness Hub Logo"
              className="w-auto h-24 transition-transform"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="nav-link">Home</a>

            {/* Workouts Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                Workouts
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#212121] border border-border shadow-lg">
                {CATEGORIES.workouts.map((category) => (
                  <DropdownMenuItem key={category.href} asChild>
                    <a
                      href={category.href}
                      onClick={(e) => handleCategoryClick(e, category.href, category.label)}
                      className="w-full cursor-pointer text-white hover:text-[#cfff6a] hover:bg-muted transition-colors duration-200"
                    >
                      {category.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Nutrition Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                Nutrition
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#212121] border border-border shadow-lg">
                {CATEGORIES.nutrition.map((category) => (
                  <DropdownMenuItem key={category.href} asChild>
                    <a
                      href={category.href}
                      onClick={(e) => handleCategoryClick(e, category.href, category.label)}
                      className="w-full cursor-pointer text-white hover:text-[#cfff6a] hover:bg-muted transition-colors duration-200"
                    >
                      {category.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-fast"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="nav-link py-2">Home</a>

              <div className="py-2">
                <div className="font-medium text-white mb-2">Workouts</div>
                {CATEGORIES.workouts.map((category) => (
                  <a
                    key={category.href}
                    href={category.href}
                    onClick={(e) => handleCategoryClick(e, category.href, category.label)}
                    className="block py-1 pl-4 text-white hover:text-[#cfff6a] transition-colors"
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              <div className="py-2">
                <div className="font-medium text-white mb-2">Nutrition</div>
                {CATEGORIES.nutrition.map((category) => (
                  <a
                    key={category.href}
                    href={category.href}
                    onClick={(e) => handleCategoryClick(e, category.href, category.label)}
                    className="block py-1 pl-4 text-white hover:text-[#cfff6a] transition-colors"
                  >
                    {category.name}
                  </a>
                ))}
              </div>

              <a href="/about" className="nav-link py-2">About</a>
              <a href="/contact" className="nav-link py-2">Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
