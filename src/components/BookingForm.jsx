import { Calendar, Clock, Users } from 'lucide-react';

const DateField = ({ value, onChange, min, error }) => (
  <div>
    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
      Reservation Date *
    </label>
    <div className="relative">
      <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
      <input
        type="date"
        id="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        
        aria-describedby={error ? 'date-error' : undefined}
      />
    </div>
    {error && (
      <p id="date-error" className="text-red-500 text-sm mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

const TimeField = ({ value, onChange, options, error }) => (
  <div>
    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
      Reservation Time *
    </label>
    <div className="relative">
      <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
      <select
        id="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        aria-describedby={error ? 'time-error' : undefined}
      >
        <option value="">Select a time</option>
        {options.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    </div>
    {error && (
      <p id="time-error" className="text-red-500 text-sm mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

const GuestsField = ({ value, onChange, error }) => (
  <div>
    <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
      Number of Guests *
    </label>
    <div className="relative">
      <Users className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
      <input
        type="number"
        id="guests"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min="1"
        max="10"
        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        aria-describedby={error ? 'guests-error' : undefined}
      />
    </div>
    {error && (
      <p id="guests-error" className="text-red-500 text-sm mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);

const OccasionField = ({ value, onChange }) => (
  <div>
    <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">
      Occasion (Optional)
    </label>
    <select
      id="occasion"
      value={value}
      onChange={(e) => onChange(e.target.value)}
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
);

const ContactFields = ({ name, email, phone, errors, onChange }) => (
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
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}

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
          type="text"
          id="email"
          value={email}
          onChange={(e) => onChange('email', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}

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
          value={phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}

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
);

const SubmitButton = ({ isLoading }) => (
  <>
    <button
      type="submit"
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
  </>
);

const BookingForm = ({ bookingState, errors, isLoading, onDateChange, onFieldChange, onSubmit, getMinDate }) => {
  return (
    <form className="space-y-4" aria-label="Table reservation form" onSubmit={onSubmit}>
      <DateField
        value={bookingState.date}
        onChange={onDateChange}
        min={getMinDate()}
        error={errors.date}
      />

      <TimeField
        value={bookingState.time}
        onChange={(val) => onFieldChange('time', val)}
        options={bookingState.availableTimes}
        error={errors.time}
      />

      <GuestsField
        value={bookingState.guests}
        onChange={(val) => onFieldChange('guests', val)}
        error={errors.guests}
      />

      <OccasionField
        value={bookingState.occasion}
        onChange={(val) => onFieldChange('occasion', val)}
      />

      <ContactFields
        name={bookingState.name}
        email={bookingState.email}
        phone={bookingState.phone}
        errors={errors}
        onChange={onFieldChange}
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default BookingForm;


