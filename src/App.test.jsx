import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LittleLemonApp from './App';

// Mock the API functions
vi.mock('./api', () => ({
  fetchAPI: vi.fn((date) => {
    const seed = new Date(date).getDate();
    const times = [];
    const baseTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    
    for (let i = 0; i < baseTimes.length; i++) {
      if ((seed + i) % 3 !== 0) {
        times.push(baseTimes[i]);
      }
    }
    return times.length > 0 ? times : ['19:00'];
  }),
  submitAPI: vi.fn(() => Promise.resolve(true))
}));

describe('Little Lemon Booking App', () => {
  
  it('renders the main heading', () => {
    render(<LittleLemonApp />);
    expect(screen.getByText('Little Lemon')).toBeInTheDocument();
  });

  it('renders the reservation form', () => {
    render(<LittleLemonApp />);
    expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    expect(screen.getByLabelText('Reservation Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('Reservation Time *')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Guests *')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LittleLemonApp />);
    
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByText('Time is required')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Phone is required')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<LittleLemonApp />);
    
    const emailInput = screen.getByLabelText('Email Address *');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  it('validates phone number format', async () => {
    render(<LittleLemonApp />);
    
    const phoneInput = screen.getByLabelText('Phone Number *');
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Phone number is invalid')).toBeInTheDocument();
    });
  });

  it('validates guest count range', async () => {
    render(<LittleLemonApp />);
    
    const guestsInput = screen.getByLabelText('Number of Guests *');
    fireEvent.change(guestsInput, { target: { value: '15' } });
    
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Guests must be between 1 and 10')).toBeInTheDocument();
    });
  });

  it('updates available times when date changes', async () => {
    render(<LittleLemonApp />);
    
    const dateInput = screen.getByLabelText('Reservation Date *');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(dateInput, { target: { value: tomorrowStr } });

    await waitFor(() => {
      const timeSelect = screen.getByLabelText('Reservation Time *');
      expect(timeSelect).toBeInTheDocument();
      // Check that time options are available
      const options = timeSelect.querySelectorAll('option');
      expect(options.length).toBeGreaterThan(1); // More than just the placeholder
    });
  });

  it('successfully submits valid form', async () => {
    render(<LittleLemonApp />);
    
    // Fill out the form with valid data
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Reservation Date *'), { 
      target: { value: tomorrowStr } 
    });
    
    await waitFor(() => {
      const timeSelect = screen.getByLabelText('Reservation Time *');
      const timeOptions = timeSelect.querySelectorAll('option');
      if (timeOptions.length > 1) {
        fireEvent.change(timeSelect, { target: { value: timeOptions[1].value } });
      }
    });
    
    fireEvent.change(screen.getByLabelText('Number of Guests *'), { 
      target: { value: '4' } 
    });
    fireEvent.change(screen.getByLabelText('Full Name *'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Phone Number *'), { 
      target: { value: '+1234567890' } 
    });

    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<LittleLemonApp />);
    
    // Check for proper labels
    expect(screen.getByLabelText('Reservation Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('Reservation Time *')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Guests *')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument();
    
    // Check for proper form roles
    expect(screen.getByRole('form', { name: /table reservation form/i })).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    render(<LittleLemonApp />);
    
    // Fill out minimum required fields
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Reservation Date *'), { 
      target: { value: tomorrowStr } 
    });
    
    fireEvent.change(screen.getByLabelText('Full Name *'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Phone Number *'), { 
      target: { value: '+1234567890' } 
    });

    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    // Should show loading state briefly
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('allows user to make another reservation after confirmation', async () => {
    render(<LittleLemonApp />);
    
    // Complete a booking first
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText('Reservation Date *'), { 
      target: { value: tomorrowStr } 
    });
    
    fireEvent.change(screen.getByLabelText('Full Name *'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Phone Number *'), { 
      target: { value: '+1234567890' } 
    });

    fireEvent.click(screen.getByRole('button', { name: /reserve table/i }));

    // Wait for confirmation
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    });

    // Click "Make Another Reservation"
    const anotherReservationButton = screen.getByRole('button', { name: /make another reservation/i });
    fireEvent.click(anotherReservationButton);

    // Should return to booking form
    await waitFor(() => {
      expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
      expect(screen.getByLabelText('Reservation Date *')).toBeInTheDocument();
    });
  });
});
