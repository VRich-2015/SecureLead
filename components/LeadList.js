'use client'; // Enables Client Component functionality in Next.js App Router

import { useState } from 'react';
import toast from 'react-hot-toast'; // Used to display toast notifications

// Component to display list of leads...edit/delete/enrich each one
export default function LeadList({ leads, onEdit, refreshLeads }) {
 
  // Stores enrichment data keyed by lead ID
  const [enriched, setEnriched] = useState({});
  // Tracks which lead is currently being enriched to show loading state
  const [loadingId, setLoadingId] = useState(null);

  // Handle deleting of a lead
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
        refreshLeads(); // Re-fetch updated list after deletion
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (err) {
      toast.error('Server error during delete');
    }
  };

  // Handle enriching a lead with mock background info
  const handleEnrich = async (lead) => {
    setLoadingId(lead._id); // Show loading for that specific lead
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lead.name, email: lead.email }), // Send name + email
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Lead enriched!');
        // Save enrichment result keyed by lead ID
        setEnriched((prev) => ({ ...prev, [lead._id]: data }));
      } else {
        toast.error(data.error || 'Enrich failed');
      }
    } catch (err) {
      toast.error('Error enriching lead');
    } finally {
      setLoadingId(null); // Reset loading state
    }
  };

  // Message if no leads have been submitted yet
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
            // Core (basic) lead information
            <strong>{lead.name}</strong> – {lead.email}
            {lead.phone && <div>📞 {lead.phone}</div>}
            {lead.location && <div>📍 {lead.location}</div>}

            // Action buttons for each lead
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onEdit(lead)}>✏️ Edit</button>
              <button onClick={() => handleDelete(lead._id)}>🗑️ Delete</button>
              <button
                onClick={() => handleEnrich(lead)}
                disabled={loadingId === lead._id}
              >
                {loadingId === lead._id ? 'Loading...' : '🔍 Enrich'}
              </button>
            </div>

            // Display enrichment details if available
            {enriched[lead._id] && (
              <div
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#f0f0f0',
                  padding: '0.5rem',
                  borderRadius: '6px',
                }}
              >
                <div><strong>Phone:</strong> {enriched[lead._id].phone}</div>
                <div><strong>Employment:</strong> {enriched[lead._id].employment}</div>
                <div><strong>Socials:</strong> {enriched[lead._id].socials.join(', ')}</div>
                <div><strong>Notes:</strong> {enriched[lead._id].notes}</div>
                <div>
                  // Link to a mock background check report page... contains mock background info
                  <a href={`/background/${lead._id}`} target="_blank" rel="noopener noreferrer">
                    🧾 View Background Report
                  </a>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
