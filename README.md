# Dance Organisation Website

## 💻 How to Run

1. Clone the repo:
   ```
   git clone https://github.com/yourusername/dance-org-site
   cd dance-org-site
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
Or, for automatic restarts on code changes:
   ```
   npm install --save-dev nodemon
   npm run dev
   ```

4. Visit: `http://localhost:3000`
   Admin: `http://localhost:3000/admin/login`

## ✅ Features Implemented

- Public users can:
  - Homepage with organisation overview and venue list

  - Search & filter courses by name, description or location

  - Available vs Upcoming sections on the courses page

  - Course cards display name, duration, date, time, location, price, description

  - Course details page with full info and enrolment form

  - Enrolment confirmation page with navigation links

- Admins can:
  - Login/Logout with secure session handling

  - Dashboard styled with Bootstrap

  - Add/Edit/Delete Courses (all fields: name, duration, date, time, location, price, description, upcoming flag)

  - Export CSV of participants for any course

  - Manage Participants per course (view & remove enrolments)

  - Manage All Users (view & remove all bookings)

  - Manage Organisers (add/delete admin accounts)

## 🔧 Technologies Used

  - Node.js & Express

  - Mustache‑Express for templating

  - NeDB for JSON‑based data storage

  - express‑session for login sessions

  - json2csv for CSV export

  - Bootstrap 5 for styling

  - nodemon (dev) for live‑reload during development