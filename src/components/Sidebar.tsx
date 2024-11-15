import React, { useState } from 'react';
import { User, Users, UserPlus, Briefcase, LineChart, LogOut, LayoutGrid } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useRequests } from '../store/requests';
import AuthModal from './AuthModal';

const demoRequestCounts = {
  personal: 12,
  pair: 5,
  group: 3,
  team: 8,
  startup: 4
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { requestCounts, requests } = useRequests();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const displayCounts = user ? requestCounts : demoRequestCounts;
  const totalCount = user ? requests.length : Object.values(demoRequestCounts).reduce((a, b) => a + b, 0);

  const menuItems = [
    { 
      icon: LayoutGrid, 
      label: 'All Requests', 
      count: totalCount, 
      path: '/' 
    },
    { 
      icon: User, 
      label: 'Personal Requests', 
      count: displayCounts.personal || 0, 
      path: '/personal' 
    },
    { 
      icon: Users, 
      label: 'Pair Requests', 
      count: displayCounts.pair || 0, 
      path: '/pair' 
    },
    { 
      icon: UserPlus, 
      label: 'Group Requests', 
      count: displayCounts.group || 0, 
      path: '/group' 
    },
    { 
      icon: Briefcase, 
      label: 'Team Building', 
      count: displayCounts.team || 0, 
      path: '/team' 
    },
    { 
      icon: LineChart, 
      label: 'Startup Validation', 
      count: displayCounts.startup || 0, 
      path: '/startup' 
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 px-3 py-4 flex flex-col">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <div 
        className="flex items-center px-3 mb-8 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <div className="bg-indigo-600 p-2 rounded-lg">
          <User className="h-6 w-6 text-white" />
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-900">TraitTune</h1>
      </div>

      <nav className="flex-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
            } group`}
          >
            <div className="flex items-center">
              <item.icon className={`h-5 w-5 mr-3 ${
                location.pathname === item.path
                  ? 'text-indigo-600'
                  : 'text-gray-400 group-hover:text-indigo-600'
              }`} />
              {item.label}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              location.pathname === item.path
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
            }`}>
              {item.count}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        {user ? (
          <div className="px-3 py-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-700">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={signOut}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-3 py-3 text-left hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Guest User</p>
                <p className="text-xs text-gray-500">Sign in to save progress</p>
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}