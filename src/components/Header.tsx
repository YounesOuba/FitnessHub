import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from "../assets/Logo/HUB.png";
import { useNavigate, useLocation, Link } from 'react-router-dom';
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

  const handleCategoryClick = (e: React.MouseEvent, href: string, label: string) => {
    e.preventDefault();
    navigate(`/category/${label}`);
    setIsMenuOpen(false); // Close mobile menu on click
  };

  return (
    <header className="bg-[#212121] border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex w-auto items-center group">
            <img
              src={Logo}
              alt="Fitness Hub Logo"
              className="w-auto h-24 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="nav-link">Home</Link>

            {/* Workouts Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="nav-link flex items-center gap-1">
                Workouts
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#212121] border border-border shadow-lg">
                {CATEGORIES.workouts.map((category) => (
                  <DropdownMenuItem key={category.href} asChild>
                    <Link
                      to={`/category/${category.label}`}
                      className="w-full cursor-pointer text-white hover:text-[#cfff6a] hover:bg-muted transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
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
                    <Link
                      to={`/category/${category.label}`}
                      className="w-full cursor-pointer text-white hover:text-[#cfff6a] hover:bg-muted transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
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
              <Link to="/" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>

              <div className="py-2">
                <div className="font-medium text-white mb-2">Workouts</div>
                {CATEGORIES.workouts.map((category) => (
                  <Link
                    key={category.href}
                    to={`/category/${category.label}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-1 pl-4 text-white hover:text-[#cfff6a] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="py-2">
                <div className="font-medium text-white mb-2">Nutrition</div>
                {CATEGORIES.nutrition.map((category) => (
                  <Link
                    key={category.href}
                    to={`/category/${category.label}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-1 pl-4 text-white hover:text-[#cfff6a] transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link to="/about" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="nav-link py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
