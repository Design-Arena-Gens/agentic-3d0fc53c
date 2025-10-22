'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Settings as SettingsIcon } from 'lucide-react';

interface Account {
  id: string;
  platform: string;
  accountName: string;
  isActive: boolean;
  lastPostAt: string | null;
}

export default function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: 'tiktok',
    accountName: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.accountName.trim()) {
      alert('Please enter an account name');
      return;
    }

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });

      if (response.ok) {
        setNewAccount({ platform: 'tiktok', accountName: '' });
        setShowAddForm(false);
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const response = await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (response.ok) {
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
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
          <SettingsIcon className="h-8 w-8 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold">Social Media Accounts</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Account
        </button>
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">Add New Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={newAccount.platform}
                onChange={(e) => setNewAccount({ ...newAccount, platform: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={newAccount.accountName}
                onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="@username or account name"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddAccount}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Add Account
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

      {/* Accounts List */}
      <div className="space-y-4">
        {accounts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No accounts added yet. Add your first account to get started!</p>
          </div>
        ) : (
          accounts.map((account) => {
            const platform = platforms.find((p) => p.id === account.platform);
            return (
              <div
                key={account.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`${platform?.color} h-12 w-12 rounded-lg flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-xl">
                      {platform?.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{account.accountName}</p>
                    <p className="text-sm text-gray-500">{platform?.name}</p>
                    {account.lastPostAt && (
                      <p className="text-xs text-gray-400">
                        Last post: {new Date(account.lastPostAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(account.id, account.isActive)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      account.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {account.isActive ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      'Inactive'
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Chrome Profiles</h3>
        <p className="text-sm text-blue-800">
          Each account gets its own Chrome profile for secure session management. You'll need to
          log in to each social media account once through the Chrome profile. After that, the
          system will automatically post to your accounts.
        </p>
      </div>
    </div>
  );
}
