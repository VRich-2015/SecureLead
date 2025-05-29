// Applies global styles and layout structure across all pages (since additional components and authentcation pages can be added )
import './globals.css';
import { Toaster } from 'react-hot-toast'; // Imports Toaster component from react-hot-toast for showing notifications

// Default metadata for the site used by Next.js for SEO and document head
export const metadata = {
  title: 'SecureLead 🏡🔍',
  description: 'A simple and free tool used to vet read estate leads before meeting them in person.',
};

// Root layout component ensures every page inside the /app folder is wrapped with global styling with access to the toast notification system.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        <Toaster position="top-right" /> {/* Toast notifications will appear in the top-right corner of the page...
         Lets your app display confirmation messages like “Lead added” or “Server error” without additional setup on each page. */}
        {children}  {/* Renders content of the specific page inside the layout */}
      </body>
    </html>
  );
}
