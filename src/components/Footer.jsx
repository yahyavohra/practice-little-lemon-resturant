import { Utensils } from 'lucide-react';

const Footer = () => {
  return (
     <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Little Lemon</h3>
              </div>
              <p className="text-green-200">
                Serving authentic Mediterranean cuisine with love and tradition since 1995.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-green-200">
                <li><a href="#home" className="hover:text-yellow-300 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-yellow-300 transition-colors">About</a></li>
                <li><a href="#menu" className="hover:text-yellow-300 transition-colors">Menu</a></li>
                <li><a href="#reservations" className="hover:text-yellow-300 transition-colors">Reservations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-green-200">
                <p>123 Mediterranean Ave</p>
                <p>Chicago, IL 60614</p>
                <p>(312) 555-0123</p>
                <p>info@littlelemon.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-green-200">
            <p>&copy; 2024 Little Lemon Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;