'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, Zap } from 'lucide-react';

interface Schedule {
  id: string;
  name: string;
  frequency: string;
  time: string;
  isActive: boolean;
  aiPrompt: string | null;
  platforms: string;
}

export default function ScheduleManager() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'daily',
    time: '09:00',
    aiPrompt: '',
    platforms: [] as string[],
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.name.trim() || newSchedule.platforms.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });

      if (response.ok) {
        setNewSchedule({
          name: '',
          frequency: 'daily',
          time: '09:00',
          aiPrompt: '',
          platforms: [],
        });
        setShowAddForm(false);
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (response.ok) {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const togglePlatform = (platformId: string) => {
    setNewSchedule((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((id) => id !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const platforms = [
    { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-600' },
    { id: 'youtube', name: 'YouTube', color: 'bg-red-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold">Automated Schedules</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Schedule
        </button>
      </div>

      {/* Add Schedule Form */}
      {showAddForm && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">Create New Schedule</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Name
              </label>
              <input
                type="text"
                value={newSchedule.name}
                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Daily Morning Post"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Video Prompt (Optional)
              </label>
              <textarea
                value={newSchedule.aiPrompt}
                onChange={(e) => setNewSchedule({ ...newSchedule, aiPrompt: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Leave empty to manually upload videos, or enter a prompt to auto-generate videos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-3 rounded-lg border-2 transition ${
                      newSchedule.platforms.includes(platform.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`${platform.color} h-8 w-8 mx-auto rounded-lg mb-1 flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-sm">{platform.name[0]}</span>
                    </div>
                    <p className="text-xs font-medium">{platform.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <button
              onClick={handleAddSchedule}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Create Schedule
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No schedules created yet. Add a schedule to automate your posting!
            </p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-lg">{schedule.name}</h3>
                    {schedule.aiPrompt && (
                      <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        AI Enabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {schedule.frequency} at {schedule.time}
                    </span>
                    <span>{(JSON.parse(schedule.platforms) as string[]).length} platforms</span>
                  </div>
                  {schedule.aiPrompt && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {schedule.aiPrompt}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(schedule.id, schedule.isActive)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      schedule.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {schedule.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">⚡ Automation Features</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• AI-generated videos are created automatically based on your prompt</li>
          <li>• Videos are posted to all selected platforms at the scheduled time</li>
          <li>• Each account uses its own Chrome profile for secure posting</li>
          <li>• Schedules run continuously until you disable them</li>
        </ul>
      </div>
    </div>
  );
}
