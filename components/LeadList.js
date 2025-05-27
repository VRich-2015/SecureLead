'use client'; // Enable client side features

import { useState } from 'react';
import toast from 'react-hot-toast';

/** LeadList Component... Displays submitted leads... Allows enriching, editing, and deleting lead*/
export default function LeadList({ leads, onEdit, refreshLeads }) {
  const [enriched, setEnriched] = useState({}); // Track enriched lead data by name (keyed object)
  const [loadingId, setLoadingId] = useState(null); // Track loading state for individual enrich requests

// Sends a DELETE request to remove lead by ID... Handle lead deletion with confirmation
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this lead?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/leads?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Lead deleted!');
        refreshLeads(); // Refresh lead list from parent
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (err) {
      toast.error('Server error during delete');
    }
  };

  // Sends a POST request to simulate enrichment (Clearbit-style) by name...Enrich  (display additional informationa) a lead using name only
  const handleEnrich = async (name) => {
    setLoadingId(name); // Disable button while enriching
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Lead enriched!'); // Stores fetched enrichment data keyed by lead name.
        setEnriched((prev) => ({ ...prev, [name]: data }));
      } else {
        toast.error(data.error || 'Enrich failed');
      }
    } catch (err) {
      toast.error('Error enriching lead');
    } finally {
      setLoadingId(null); // Re-enable button
    }
  };

  // If no leads have been submitted yet
  if (!leads.length) {
    return <p style={{ textAlign: 'center' }}>No leads yet. Submit one above!</p>;
  }

  return (
    <section style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h3 style={{ textAlign: 'center' }}>Submitted Leads 📋</h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {leads.map((lead) => (
          <li
            key={lead._id}
            style={{
              padding: '1rem',
              borderBottom: '1px solid #ddd',
              backgroundColor: '#fafafa',
              marginBottom: '0.5rem',
              borderRadius: '6px',
            }}
          >
           {/* Display core lead info (unenriched info)*/}
            <strong>{lead.name}</strong> – {lead.email}
            {lead.phone && <div>📞 {lead.phone}</div>}
            {lead.location && <div>📍 {lead.location}</div>}

           {/* Action buttons */}    
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onEdit(lead)}>✏️ Edit</button>
              <button onClick={() => handleDelete(lead._id)}>🗑️ Delete</button>
              <button onClick={() => handleEnrich(lead.name)} disabled={loadingId === lead.name}>
                {loadingId === lead.name ? 'Loading...' : '🔍 Enrich'}
              </button>
            </div>

          {/* If enriched, show additional details */}
            {enriched[lead.name] && (
              <div style={{ marginTop: '0.5rem', backgroundColor: '#f0f0f0', padding: '0.5rem', borderRadius: '6px' }}>
                <div><strong>Phone:</strong> {enriched[lead.name].phone}</div>
                <div><strong>Location:</strong> {enriched[lead.name].location}</div>
                <div><strong>Socials:</strong> {enriched[lead.name].socials.join(', ')}</div>
                <div><strong>Notes:</strong> {enriched[lead.name].notes}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
