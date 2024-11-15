import React, { useState } from 'react';
import { Search, Clock, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRequests } from '../store/requests';
import { useAuth } from '../lib/auth';
import DeleteRequestModal from './DeleteRequestModal';

const demoRequests = [
  {
    id: 'demo-1',
    type: 'personal',
    status: 'completed',
    currentModule: 5,
    createdAt: '2024-03-15',
    title: 'Career Development Assessment',
  },
  {
    id: 'demo-2',
    type: 'team',
    status: 'in_progress',
    currentModule: 3,
    createdAt: '2024-03-14',
    title: 'Product Team Formation',
  },
  {
    id: 'demo-3',
    type: 'startup',
    status: 'pending',
    currentModule: 4,
    createdAt: '2024-03-13',
    title: 'AI Startup Team Analysis',
  },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { requests, deleteRequest, getRequestProgress } = useRequests();
  const { user } = useAuth();

  const getCurrentSection = () => {
    const path = location.pathname.substring(1);
    const sections = {
      '': 'All',
      'personal': 'Personal',
      'pair': 'Pair',
      'group': 'Group',
      'team': 'Team Building',
      'startup': 'Startup Validation'
    };
    return sections[path as keyof typeof sections] || 'All';
  };

  const getModuleLabel = (currentModule: number) => {
    const modules = {
      2: 'Initial Assessment',
      3: 'Psychometric Testing',
      4: 'Additional Assessment',
      5: 'Final Report'
    };
    return modules[currentModule as keyof typeof modules] || 'Unknown Stage';
  };

  const getRequestTitle = (type: string) => {
    const titles = {
      personal: 'Personal Request',
      pair: 'Pair Request',
      group: 'Group Request',
      team: 'Team Building Request',
      startup: 'Startup Validation Request'
    };
    return titles[type as keyof typeof titles] || type;
  };

  const handleRequestClick = (request: any) => {
    if (!user) {
      // For demo requests, use the default module routing
      const moduleRoutes = {
        2: `/new-request`,
        3: `/assessment/${request.id}`,
        4: `/module4/${request.id}`,
        5: `/report/${request.id}`
      };
      
      const route = moduleRoutes[request.currentModule as keyof typeof moduleRoutes];
      if (route) {
        navigate(route);
      }
      return;
    }

    // For authenticated users, check saved progress
    const progress = getRequestProgress(request.id);
    if (progress) {
      // Navigate to the last accessed path
      navigate(progress.lastPath);
    } else {
      // If no progress is saved, determine the appropriate module based on request state
      let targetModule = 2;
      const moduleData = request.moduleData;

      if (moduleData.module4?.summary) {
        targetModule = 5;
      } else if (moduleData.module3?.summary) {
        targetModule = 4;
      } else if (moduleData.module2?.summary) {
        targetModule = 3;
      }

      const moduleRoutes = {
        2: `/new-request`,
        3: `/assessment/${request.id}`,
        4: `/module4/${request.id}`,
        5: `/report/${request.id}`
      };

      navigate(moduleRoutes[targetModule as keyof typeof moduleRoutes]);
    }
  };

  const displayRequests = user ? requests : demoRequests;
  const filteredRequests = displayRequests.filter(request => {
    const matchesSearch = (
      getRequestTitle(request.type).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.title && request.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const matchesSection = location.pathname === '/' || 
      location.pathname.substring(1) === request.type;
    
    return matchesSearch && matchesSection;
  });

  const handleDeleteClick = (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    setSelectedRequestId(requestId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRequestId) {
      await deleteRequest(selectedRequestId);
      setShowDeleteModal(false);
      setSelectedRequestId(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {getCurrentSection()} Requests
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => navigate('/new-request')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Request
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Requests</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => {
              const progress = user ? getRequestProgress(request.id) : null;
              
              return (
                <div
                  key={request.id}
                  onClick={() => handleRequestClick(request)}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {request.title || getRequestTitle(request.type)}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {request.status.replace('_', ' ').charAt(0).toUpperCase() + 
                             request.status.slice(1).replace('_', ' ')}
                          </span>
                          {user && (
                            <button
                              onClick={(e) => handleDeleteClick(e, request.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500">{request.type}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-indigo-600 font-medium flex items-center">
                          {progress 
                            ? getModuleLabel(progress.lastModule)
                            : getModuleLabel(request.currentModule)}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredRequests.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No requests found
              </div>
            )}
          </div>
        </div>

        <DeleteRequestModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          requestId={selectedRequestId || ''}
        />
      </div>
    </div>
  );
}