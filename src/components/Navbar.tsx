
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Documentation", path: "/documentation" },
  { name: "Settings", path: "/settings" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300",
        isScrolled ? "glass-morphism shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className={fadeIn({ className: "flex items-center space-x-2" })}>
          <div className="relative w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center overflow-hidden">
            <span className="font-semibold text-xl">W</span>
          </div>
          <span className="text-xl font-medium">WhisperLocal</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-6">
            {navigation.map((item, i) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  fadeIn({ delay: 100 + i * 50 }),
                  "text-sm font-medium relative px-2 py-1 transition-colors",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
          
          <div className={fadeIn({ delay: 250 })}>
            <a
              href="https://github.com/username/whisperlocal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="font-medium text-sm">GitHub</span>
            </a>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button
          className={cn(fadeIn({ delay: 250 }), "md:hidden text-foreground")}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileOpen && (
        <div className="absolute top-full left-0 right-0 glass-morphism p-6 flex flex-col space-y-4 mt-1 shadow-lg md:hidden">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-lg font-medium py-2",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-foreground/70"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <a
            href="https://github.com/username/whisperlocal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-3 px-4 rounded-lg"
            onClick={() => setIsMobileOpen(false)}
          >
            <span>GitHub</span>
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
