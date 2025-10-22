'use client';

import { useState } from 'react';
import { Upload, Video, Calendar, Plus, Settings, Home } from 'lucide-react';
import Link from 'next/link';
import VideoUpload from '@/components/VideoUpload';
import AccountManager from '@/components/AccountManager';
import ScheduleManager from '@/components/ScheduleManager';
import AIVideoGenerator from '@/components/AIVideoGenerator';

type Tab = 'upload' | 'accounts' | 'schedule' | 'ai-generate';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <Link href="/">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <TabButton
                active={activeTab === 'upload'}
                onClick={() => setActiveTab('upload')}
                icon={<Upload className="h-5 w-5" />}
                label="Upload Video"
              />
              <TabButton
                active={activeTab === 'ai-generate'}
                onClick={() => setActiveTab('ai-generate')}
                icon={<Video className="h-5 w-5" />}
                label="AI Generate"
              />
              <TabButton
                active={activeTab === 'accounts'}
                onClick={() => setActiveTab('accounts')}
                icon={<Settings className="h-5 w-5" />}
                label="Accounts"
              />
              <TabButton
                active={activeTab === 'schedule'}
                onClick={() => setActiveTab('schedule')}
                icon={<Calendar className="h-5 w-5" />}
                label="Schedule"
              />
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'upload' && <VideoUpload />}
          {activeTab === 'ai-generate' && <AIVideoGenerator />}
          {activeTab === 'accounts' && <AccountManager />}
          {activeTab === 'schedule' && <ScheduleManager />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition ${
        active
          ? 'border-purple-600 text-purple-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
