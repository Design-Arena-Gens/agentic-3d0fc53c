'use client';

import { useState } from 'react';
import { Upload, Video, Calendar, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Social Media Automation
              </h1>
            </div>
            <Link href="/dashboard">
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Post to All Social Platforms
            <span className="text-purple-600"> Automatically</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload once, post everywhere. AI-powered video generation with automated scheduling
            for TikTok, Facebook, Instagram, and YouTube.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-lg">
                Start Free Trial
              </button>
            </Link>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-purple-600 hover:bg-purple-50 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-16">
          Everything You Need to Scale Your Content
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Upload className="h-12 w-12 text-purple-600" />}
            title="One-Click Upload"
            description="Upload a single video and automatically post it to all your social media accounts"
          />
          <FeatureCard
            icon={<Video className="h-12 w-12 text-purple-600" />}
            title="AI Video Generation"
            description="Generate engaging videos using AI based on your prompts and preferences"
          />
          <FeatureCard
            icon={<Calendar className="h-12 w-12 text-purple-600" />}
            title="Smart Scheduling"
            description="Schedule posts for optimal engagement times across all platforms"
          />
          <FeatureCard
            icon={<Settings className="h-12 w-12 text-purple-600" />}
            title="Chrome Profiles"
            description="Manage separate Chrome profiles for each social media account securely"
          />
        </div>
      </section>

      {/* Platforms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h3 className="text-3xl font-bold text-center mb-12">
            Supported Platforms
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            <PlatformCard name="TikTok" color="bg-black" />
            <PlatformCard name="Facebook" color="bg-blue-600" />
            <PlatformCard name="Instagram" color="bg-gradient-to-br from-purple-600 to-pink-600" />
            <PlatformCard name="YouTube" color="bg-red-600" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <StatCard number="10K+" label="Videos Posted" />
          <StatCard number="50+" label="Active Users" />
          <StatCard number="4" label="Platforms Supported" />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-purple-600 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h3 className="text-4xl font-bold mb-4">
            Ready to Automate Your Social Media?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who save hours every week
          </p>
          <Link href="/dashboard">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Social Media Automation. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PlatformCard({ name, color }: any) {
  return (
    <div className="text-center">
      <div className={`${color} h-24 w-24 mx-auto rounded-2xl shadow-lg mb-4 flex items-center justify-center`}>
        <span className="text-white font-bold text-2xl">{name[0]}</span>
      </div>
      <p className="font-semibold text-gray-900">{name}</p>
    </div>
  );
}

function StatCard({ number, label }: any) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-center mb-2">
        <TrendingUp className="h-8 w-8 text-purple-600 mr-2" />
        <p className="text-4xl font-bold text-gray-900">{number}</p>
      </div>
      <p className="text-gray-600 text-lg">{label}</p>
    </div>
  );
}
