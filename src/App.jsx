import React, { useState, useReducer } from 'react';
import { Calendar, Clock, Users, Phone, Mail, MapPin, Star, ChefHat, Utensils } from 'lucide-react';

// Booking reducer for state management
const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_AVAILABLE_TIMES':
      return { ...state, availableTimes: action.times };
    case 'RESET_FORM':
      return {
        date: '',
        time: '',
        guests: 1,
        occasion: '',
        name: '',
        email: '',
        phone: '',
        availableTimes: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00']
      };
    case 'SUBMIT_BOOKING':
      return { ...state, isSubmitted: true };
    default:
      return state;
  }
};

// Initial state
const initialBookingState = {
  date: '',
  time: '',
  guests: 1,
  occasion: '',
  name: '',
  email: '',
  phone: '',
  availableTimes: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
  isSubmitted: false
};

// Mock API function to simulate fetching available times
const fetchAPI = (date) => {
  const seed = new Date(date).getDate();
  const times = [];
  const baseTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
  
  for (let i = 0; i < baseTimes.length; i++) {
    if ((seed + i) % 3 !== 0) {
      times.push(baseTimes[i]);
    }
  }
  return times.length > 0 ? times : ['19:00'];
};

// Mock API function to submit booking
const submitAPI = (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
      console.log(formData)
    }, 1000);
  });
};

const App = () => {
  const [bookingState, dispatch] = useReducer(bookingReducer, initialBookingState);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update available times when date changes
  const handleDateChange = (date) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'date', value: date });
    const availableTimes = fetchAPI(date);
    dispatch({ type: 'SET_AVAILABLE_TIMES', times: availableTimes });
    dispatch({ type: 'UPDATE_FIELD', field: 'time', value: '' });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingState.date) newErrors.date = 'Date is required';
    if (!bookingState.time) newErrors.time = 'Time is required';
    if (bookingState.guests < 1 || bookingState.guests > 10) {
      newErrors.guests = 'Guests must be between 1 and 10';
    }
    if (!bookingState.name.trim()) newErrors.name = 'Name is required';
    if (!bookingState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(bookingState.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!bookingState.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-()]+$/.test(bookingState.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await submitAPI(bookingState);
      if (success) {
        dispatch({ type: 'SUBMIT_BOOKING' });
      }
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (bookingState.isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your reservation at Little Lemon. We look forward to serving you!
          </p>
          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-700">
              <p><strong>Date:</strong> {bookingState.date}</p>
              <p><strong>Time:</strong> {bookingState.time}</p>
              <p><strong>Guests:</strong> {bookingState.guests}</p>
              <p><strong>Name:</strong> {bookingState.name}</p>
            </div>
          </div>
          <button 
            onClick={() => dispatch({ type: 'RESET_FORM' })}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Make Another Reservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="bg-green-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Reserve Your Table</h2>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Experience authentic Mediterranean cuisine in a warm, welcoming atmosphere. 
            Book your table today and let us create an unforgettable dining experience for you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-8xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <MapPin className="w-6 h-6 text-green-600 mr-2" />
                Restaurant Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-600">123 Mediterranean Ave, Chicago, IL 60614</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">(312) 555-0123</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">info@littlelemon.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Hours</p>
                    <p className="text-gray-600">Mon-Thu: 5:00 PM - 10:00 PM</p>
                    <p className="text-gray-600">Fri-Sat: 5:00 PM - 11:00 PM</p>
                    <p className="text-gray-600">Sun: 5:00 PM - 9:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">(4.9/5 from 847 reviews)</span>
                </div>
                <p className="text-gray-600 italic">
                  "Outstanding Mediterranean cuisine with exceptional service. 
                  The atmosphere is perfect for both intimate dinners and family gatherings."
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-green-600 mr-2" />
                Make a Reservation
              </h3>

              <div className="space-y-4" role="form" aria-label="Table reservation form">
                
                {/* Date Selection */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Reservation Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      id="date"
                      value={bookingState.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getMinDate()}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      aria-describedby={errors.date ? 'date-error' : undefined}
                    />
                  </div>
                  {errors.date && (
                    <p id="date-error" className="text-red-500 text-sm mt-1" role="alert">
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Reservation Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <select
                      id="time"
                      value={bookingState.time}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'time', value: e.target.value })}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      aria-describedby={errors.time ? 'time-error' : undefined}
                    >
                      <option value="">Select a time</option>
                      {bookingState.availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  {errors.time && (
                    <p id="time-error" className="text-red-500 text-sm mt-1" role="alert">
                      {errors.time}
                    </p>
                  )}
                </div>

                {/* Number of Guests */}
                <div>
                  <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <Users className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      id="guests"
                      value={bookingState.guests}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'guests', value: parseInt(e.target.value) })}
                      min="1"
                      max="10"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.guests ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                      aria-describedby={errors.guests ? 'guests-error' : undefined}
                    />
                  </div>
                  {errors.guests && (
                    <p id="guests-error" className="text-red-500 text-sm mt-1" role="alert">
                      {errors.guests}
                    </p>
                  )}
                </div>

                {/* Occasion */}
                <div>
                  <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
                    Occasion (Optional)
                  </label>
                  <select
                    id="occasion"
                    value={bookingState.occasion}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'occasion', value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select an occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="date-night">Date Night</option>
                    <option value="business">Business Dinner</option>
                    <option value="celebration">Celebration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Personal Information */}
                <div className="border-t pt-4 mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={bookingState.name}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={bookingState.email}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={bookingState.phone}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'phone', value: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  aria-describedby="submit-status"
                >
                  {isLoading ? 'Processing...' : 'Reserve Table'}
                </button>
                
                {isLoading && (
                  <p id="submit-status" className="text-center text-gray-600" aria-live="polite">
                    Processing your reservation...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
};

export default App;