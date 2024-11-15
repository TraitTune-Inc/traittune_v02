import React from 'react';
import { User, Users, UserPlus, Briefcase, LineChart } from 'lucide-react';

const requestTypes = [
  {
    id: 'personal',
    icon: User,
    title: 'Personal Request',
    description: 'Individual assessment for personal development',
  },
  {
    id: 'pair',
    icon: Users,
    title: 'Pair Request',
    description: 'Assessment for two people relationship dynamics',
  },
  {
    id: 'group',
    icon: UserPlus,
    title: 'Group Request',
    description: 'Analysis for multiple people interactions',
  },
  {
    id: 'team',
    icon: Briefcase,
    title: 'Team Building',
    description: 'Project team formation and compatibility',
  },
  {
    id: 'startup',
    icon: LineChart,
    title: 'Startup Validation',
    description: 'Startup team assessment for investors',
  },
];

interface RequestTypeProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

export default function RequestType({ selectedType, onSelect }: RequestTypeProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Select Request Type</h2>
      <div className="grid grid-cols-1 gap-4">
        {requestTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex items-start p-4 border rounded-lg transition-colors ${
              selectedType === type.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-600 hover:bg-gray-50'
            }`}
          >
            <div
              className={`p-2 rounded-lg ${
                selectedType === type.id ? 'bg-indigo-600' : 'bg-gray-100'
              }`}
            >
              <type.icon
                className={`w-6 h-6 ${
                  selectedType === type.id ? 'text-white' : 'text-gray-600'
                }`}
              />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-sm font-medium text-gray-900">{type.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{type.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}