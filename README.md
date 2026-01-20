# Takamul Project Management System

A comprehensive project management system built with Vite + React (JSX) and Tailwind CSS, featuring a mock API that can be easily replaced with a real backend.

## Features

- 🔐 **Authentication** - Login and signup with mock authentication
- 📊 **Dashboard** - Overview with statistics and recent activity
- 📁 **Project Management** - Create, edit, delete, and track projects
- ✅ **Task Management** - Organize tasks with assignments and due dates
- 👥 **Team Management** - View team members and their roles
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works seamlessly on all devices

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Test Credentials

You can use the following credentials to login:
- **Email:** ahmed@takamul.com
- **Password:** password123

Or create a new account using the signup page.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── ProjectModal.jsx
│   ├── Sidebar.jsx
│   └── TaskModal.jsx
├── context/            # React context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── ProjectDetail.jsx
│   ├── Projects.jsx
│   ├── Signup.jsx
│   ├── Tasks.jsx
│   └── Team.jsx
├── services/           # API services
│   └── mockAPI.js      # Mock API (replace with real API)
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Mock API

The application uses a mock API service (`src/services/mockAPI.js`) that simulates backend functionality. This makes it easy to develop and test without a backend, and can be seamlessly replaced with real API calls when ready.

### Replacing with Real API

To connect to a real backend:

1. Update the functions in `src/services/mockAPI.js` to make actual HTTP requests
2. Use libraries like `axios` or `fetch` for API calls
3. Update authentication to handle real tokens and sessions
4. Ensure your backend API matches the expected response format

Example:
```javascript
// Instead of mockAPI.login(email, password)
// Use: axios.post('/api/auth/login', { email, password })
```

## Technologies Used

- **Vite** - Build tool and dev server
- **React** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Dashboard
- Overview statistics (projects, tasks, team members)
- Recent projects with progress tracking
- Recent tasks list
- Completion rate metrics

### Projects
- List all projects with filtering and search
- Create new projects
- Edit existing projects
- Delete projects
- View project details
- Track progress and status

### Tasks
- List all tasks with filtering by status and project
- Create new tasks
- Edit and delete tasks
- Assign tasks to team members
- Set due dates and priorities
- Track task status

### Team
- View all team members
- See member roles and projects
- Search and filter team members
- Team statistics

## License

This project is open source and available for use.

