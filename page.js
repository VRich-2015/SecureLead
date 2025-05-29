// Displays a mock background report based on the lead's name in the URL (All info the same for demo purposes)
// File path /app/background/[name]/page.js ***SAME AS PAGE.JS IN BACKGROUND FOLDER (I couldn't figure out how to add a new folder in place).

'use client';
import { useParams } from 'next/navigation';

export default function BackgroundReport() {
  const { name } = useParams(); // extracts the dynamic name from the URL

  // Fake mock data
  const report = {
    employmentHistory: [
          { company: 'Home Depot', role: 'Sales Associate', years: '2018–2020' },
          { company: 'Meta Applications Inc.', role: 'Junior Software Engineer', years: '2020–2023' },
          { company: 'Nova WorldWide', role: 'Senior Software Engineer', years: '2023–Current' },
    ],
    criminalRecord: 'Clear (No criminal history found)',
    financialStanding: 'Good (No bankruptcies or liens reported)',
    socialPresence: [
      'https://facebook.com/' + name,
      'https://linkedin.com/in/' + name,
    ],
    notes: 'Lead shows consistent employment and a clean background.'
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Background Report: {name.replace(/-/g, ' ')}</h1>

      <section>
        <h2>🔨 Employment History</h2>
        <ul>
          {report.employmentHistory.map((job, index) => (
            <li key={index}>
              {job.role} at <strong>{job.company}</strong> ({job.years})
            </li>
          ))}
        </ul>

        <h2>🕵️‍♀️ Criminal Record</h2>
        <p>{report.criminalRecord}</p>

        <h2>💰 Financial Standing</h2>
        <p>{report.financialStanding}</p>

        <h2>🌐 Social Media</h2>
        <ul>
          {report.socialPresence.map((link, idx) => (
            <li key={idx}>
              <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
            </li>
          ))}
        </ul>

        <h2>📝 Notes</h2>
        <p>{report.notes}</p>
      </section>
    </main>
  );
}
