import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';


describe('Little Lemon Booking App', () => {
  
  it('renders the main heading', () => {
    render(<App />);
       expect(
      screen.getByRole('heading', { level: 1, name: 'Little Lemon' })
    ).toBeInTheDocument();
  });

  it('renders the reservation form', () => {
    render(<App />);
    expect(screen.getByText('Make a Reservation')).toBeInTheDocument();
    expect(screen.getByLabelText('Reservation Date *')).toBeInTheDocument();
    expect(screen.getByLabelText('Reservation Time *')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Guests *')).toBeInTheDocument();
  });

it('validates required fields', async () => {
  render(<App />);

  const submitButton = screen.getByRole('button', { name: /reserve table/i });
  await userEvent.click(submitButton);

  expect(
    await screen.findByText((content) => content.includes('Date is required'))
  ).toBeInTheDocument();
  expect(
    await screen.findByText((content) => content.includes('Time is required'))
  ).toBeInTheDocument();
  expect(
    await screen.findByText((content) => content.includes('Name is required'))
  ).toBeInTheDocument();
});

it('validates email format', async () => {
  render(<App />);

  const emailInput = screen.getByLabelText('Email Address *');
  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

  const submitButton = screen.getByRole('button', { name: /reserve table/i });
   await userEvent.click(submitButton); // trigger form validation

  await waitFor(() => {
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  });
});


  it('validates phone number format', async () => {
    render(<App />);
    
    const phoneInput = screen.getByLabelText('Phone Number *');
    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    
    const submitButton = screen.getByRole('button', { name: /reserve table/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Phone number is invalid')).toBeInTheDocument();
    });
  });


  it('updates available times when date changes', async () => {
    render(<App />);
    
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
    render(<App />);
    
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
    render(<App />);
    
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

});
