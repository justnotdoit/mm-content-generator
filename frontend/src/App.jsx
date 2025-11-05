import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ContentGenerator from './components/ContentGenerator';
import PostLibrary from './components/PostLibrary';
import Analytics from './components/Analytics';
import ContentCalendar from './components/ContentCalendar';
import Dashboard from './components/Dashboard';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : 'hover:bg-blue-600';
  };

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">⚙️</span>
            <h1 className="text-xl font-bold">Module Masters Content Generator</h1>
          </div>
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded transition ${isActive('/')}`}
            >
              Dashboard
            </Link>
            <Link
              to="/generate"
              className={`px-4 py-2 rounded transition ${isActive('/generate')}`}
            >
              Generate
            </Link>
            <Link
              to="/library"
              className={`px-4 py-2 rounded transition ${isActive('/library')}`}
            >
              Library
            </Link>
            <Link
              to="/calendar"
              className={`px-4 py-2 rounded transition ${isActive('/calendar')}`}
            >
              Calendar
            </Link>
            <Link
              to="/analytics"
              className={`px-4 py-2 rounded transition ${isActive('/analytics')}`}
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<ContentGenerator />} />
            <Route path="/library" element={<PostLibrary />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
