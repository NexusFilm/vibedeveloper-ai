import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/SupabaseAuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, signInWithOAuth } = useAuth();

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate('/Dashboard');
    } else {
      // Sign in with OAuth provider (Google, GitHub, etc.)
      try {
        await signInWithOAuth('google'); // Change to your preferred provider
      } catch (error) {
        console.error('Sign in error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          VibeDeveloper AI
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300">
          Transform your ideas into reality with AI-powered development
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={handleGetStarted}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/Examples')}>
            View Examples
          </Button>
        </div>
      </div>
    </div>
  );
}
