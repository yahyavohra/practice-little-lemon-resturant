import { Utensils } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-green-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Little Lemon</h1>
                    <p className="text-green-200 text-sm">Mediterranean Restaurant</p>
                </div>
                </div>
                <nav className="hidden md:flex space-x-6">
                <a href="#home" className="hover:text-yellow-300 transition-colors">Home</a>
                <a href="#about" className="hover:text-yellow-300 transition-colors">About</a>
                <a href="#menu" className="hover:text-yellow-300 transition-colors">Menu</a>
                <a href="#reservations" className="hover:text-yellow-300 transition-colors">Reservations</a>
                </nav>
            </div>
            </div>
        </header>  
      );
};

export default Header;