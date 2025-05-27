// Enable use of hooks and client-only features
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';  // For notification messages...Success, failure, validation
import './LeadForm.css';


/** LeadForm Component...Used to add or edit a lead...Supports real-time validation... Uses dynamic rendering for create/edit mode*/
export default function LeadForm({ onNewLead, selectedLead, onCancelEdit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

   // Error state for validation
  const [errors, setErrors] = useState({});
   // Submission status: idle | loading
  const [status, setStatus] = useState('idle');

  // Pre-fill form when editing a lead
  useEffect(() => {
    if (selectedLead) {
      setForm({
        name: selectedLead.name || '',
        email: selectedLead.email || '',
        phone: selectedLead.phone || '',
        location: selectedLead.location || '',
      });
    }
  }, [selectedLead]);

// Field-level validation for email and phone
  const validate = (field, value) => {
    const newErrors = { ...errors };

    if (field === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      newErrors.email = isValid ? '' : 'Invalid email';
    }

    if (field === 'phone') {
      const isValid = value === '' || /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(value);
      newErrors.phone = isValid ? '' : 'Phone must be 10 digits';
    }

    setErrors(newErrors);
  };

  // Handles input changes and update form state or re-validate
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  // Clear form and reset state
  const clearForm = () => {
    setForm({ name: '', email: '', phone: '', location: '' });
    setErrors({});
    setStatus('idle');
    onCancelEdit(); // Exit edit mode if applicable
  };

  // Submit form — POST for new and PUT for update... Sends data to /api/leads (POST or PUT depending on mode)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) { // Check required fields
      toast.error('Name and email are required');
      return;
    }

    if (errors.email || errors.phone) { // Check for validation errors
      toast.error('Fix errors before submitting');
      return;
    }

    setStatus('loading');

    // Decide endpoint and payload based on mode
    const endpoint = '/api/leads';
    const method = selectedLead ? 'PUT' : 'POST';

    const payload = selectedLead
      ? { ...form, id: selectedLead._id }
      : form;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Error handler
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to submit lead');
        return;
      }

      await res.json().catch(() => null); // avoid breaking on missing/invalid JSON

      // "Toast" to successful lead update!
      toast.success(selectedLead ? 'Lead updated!' : 'Lead added!');
      clearForm(); // Reset form
      onNewLead(); // Refresh lead list 

    } catch (err) {
      console.error('Unexpected error during submit:', err);
      toast.error('Server error'); // Toast notification displayed
    } finally {
      setStatus('idle');
    }
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <h2>{selectedLead ? 'Edit Lead ✏️' : 'Submit a New Lead 🔍'}</h2>

      <label>Name</label>
      <input name="name" value={form.name} onChange={handleChange} required />

      <label>Email</label>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <label>Phone</label>
      <input name="phone" value={form.phone} onChange={handleChange} />
      {errors.phone && <p className="error">{errors.phone}</p>}

      <label>Location</label>
      <input name="location" value={form.location} onChange={handleChange} />

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading'
            ? selectedLead
              ? 'Updating...'
              : 'Submitting...'
            : selectedLead
            ? 'Update Lead'
            : 'Add Lead'}
        </button>
        <button type="button" onClick={clearForm} disabled={status === 'loading'}>
          {selectedLead ? 'Cancel Edit' : 'Clear'}
        </button>
      </div>
    </form>
  );
}

