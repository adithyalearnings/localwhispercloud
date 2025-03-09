
import { fadeUp } from "@/lib/animations";
import { Link } from "react-router-dom";
import { Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className={fadeUp({ className: "border-t border-border pt-16" })}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="relative w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center overflow-hidden">
                  <span className="font-semibold text-xl">W</span>
                </div>
                <span className="text-xl font-medium">WhisperLocal</span>
              </Link>
              <p className="text-foreground/70 mb-6 max-w-md">
                A powerful, minimalist application for transcribing audio locally on your machine.
                Complete privacy, minimal design, maximum efficiency.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com/username" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://github.com/username/whisperlocal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="mailto:contact@example.com" 
                  className="hover:text-primary transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/documentation" className="text-foreground/70 hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/username/whisperlocal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/openai/whisper" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-primary transition-colors"
                  >
                    About Whisper Model
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-foreground/70 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-foreground/70 hover:text-primary transition-colors">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link to="/license" className="text-foreground/70 hover:text-primary transition-colors">
                    License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-foreground/60 mb-4 md:mb-0">
              © {new Date().getFullYear()} WhisperLocal. All rights reserved.
            </p>
            <p className="text-sm text-foreground/60">
              Built with <span className="text-red-500">♥</span> for privacy and efficiency
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
