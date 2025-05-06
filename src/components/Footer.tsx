
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-finance-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-white">Finance</span>
              <span className="text-gold-500">News</span>
            </h3>
            <p className="text-gray-300 text-sm">
              Your trusted source for financial news, market updates, and economic insights.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Sections</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-gold-400">Home</Link></li>
              <li><Link to="/markets" className="hover:text-gold-400">Markets</Link></li>
              <li><Link to="/business" className="hover:text-gold-400">Business</Link></li>
              <li><Link to="/economy" className="hover:text-gold-400">Economy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/about" className="hover:text-gold-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-gold-400">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/terms" className="hover:text-gold-400">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-gold-400">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400 flex flex-col md:flex-row justify-between">
          <p>© {year} Finance News. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold-400">Twitter</a>
            <a href="#" className="hover:text-gold-400">LinkedIn</a>
            <a href="#" className="hover:text-gold-400">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
