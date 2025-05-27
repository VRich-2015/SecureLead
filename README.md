SecureLead is a full-stack web application designed for real estate professionals (or any other professional in an lead beased industry) to quickly vet new leads before meeting in person. Agents can search for potential clients by phone number, name, and email address and receive insights like contact info, location, social media profiles, and background check simulations. 

---

 Tech Stack

-Frontend: Next.js (React 18)
- Backend: Next.js API Routes (REST)
- Database: MongoDB Atlas
- Enrichment: Mock Enrichment API (custom logic)
- Feedback/Action Notifications: react-hot-toast
- State Management: React Context API
- Styling: CSS Modules
- Testing: Mocha + Chai Testing Library
- Full CRUD tested via Mocha/Chai...Thunder Client used for integration checks
- Edge cases handled: empty fields, invalid emails/phones, missing ID
- Deployment: Vercel

---

Application Features

- Lead search by name, phone number, email address, and location
- Location and contact info retrieval
- Manage real estate leads
- Edit or delete existing leads
- Social media profile linking
- Simulated background enrichment checks
- Instant feedback using real-time form validation and toast notifications
- Responsive UI for mobile and desktop
- Free, open lead search application

---

Setup

```bash
git clone https://github.com/your-username/securelead.git
cd securelead
npm install
npm run dev
