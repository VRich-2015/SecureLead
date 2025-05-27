'use client'; // Marks file as a client component for hook use like useState/useEffect

import { useEffect, useState } from 'react';
import LeadForm from '../components/LeadForm'; // Component to reate and add edit leads
import LeadList from '../components/LeadList'; // Component that displays all submitted leads
import toast from 'react-hot-toast'; // User freindly Toast notification

export default function HomePage() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null); // for edit mode

  // Fetch all leads from the backend or API
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      toast.error('Failed to load leads'); // Toast error displays if fetch fails
    }
  };

  // Load all leads when page first loads
  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter leads based on name, email, phone, or location (case-insensitive)
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      (lead.phone && lead.phone.includes(term)) ||
      (lead.location && lead.location.toLowerCase().includes(term))
    );
  });

  // Called when a user clicks "Edit"...Puts a selected lead in "edit mode"
  const handleEdit = (lead) => {
    setSelectedLead(lead);
  };

  // Clears the selected lead and cancels edit mode
  const handleCancelEdit = () => {
    setSelectedLead(null);
  };

  // Called when user clicks "Enrich"...Simulates enrichment and shows enriched data (more mock information displayed).
  const handleEnrich = async (lead) => {
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lead.name, email: lead.email }),
      });

      const data = await res.json();

      if (res.ok) {
        const enrichedInfo = ` 
          📍 Location: ${data.location}
          📞 Phone: ${data.phone}
          🔗 Socials: ${data.socials.join(', ')}
          📝 Notes: ${data.notes}
        `;
        toast.success(enrichedInfo, { duration: 6000 }); // Shows enriched info in a toast
      } else {
        toast.error(data.error || 'Error enriching lead');
      }
    } catch (err) {
      toast.error('Server error');
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>SecureLead Dashboard 🏡</h1>
      <p style={{ textAlign: 'center', marginTop: '-0.5rem', color: '#555' }}>
        A simple tool for vetting your leads before meeting them. 
      </p>

      {/* Lead submission for adding or editing leads */}
      <LeadForm
        onNewLead={fetchLeads}
        selectedLead={selectedLead}
        onCancelEdit={handleCancelEdit}
      />

        {/* Search bar to filter leads */}
      <div style={{ display: 'flex', gap: '0.5rem', margin: '2rem 0' }}>
        <input
          type="text"
          placeholder="Search by name, email, phone, or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        )}
      </div>

       {/* Lead list that supports editing and enriching */}
      <LeadList
        leads={filteredLeads}
        onEdit={handleEdit}
        onEnrich={handleEnrich}
      />
    </main>
  );
}
