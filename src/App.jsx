import { useState, useReducer } from 'react';
import { Calendar, Clock, Phone, Mail, MapPin, Star, ChefHat } from 'lucide-react';
import { BookingForm, Header, HeroSection, Footer } from './components';

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
      <Header />

      {/* Hero Section */}
      <HeroSection/>

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
              <BookingForm
                bookingState={bookingState}
                errors={errors}
                isLoading={isLoading}
                onDateChange={handleDateChange}
                onFieldChange={(field, value) => dispatch({ type: 'UPDATE_FIELD', field, value })}
                onSubmit={handleSubmit}
                getMinDate={getMinDate}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default App;