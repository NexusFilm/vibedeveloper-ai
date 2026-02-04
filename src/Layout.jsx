import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from './api/base44Client';
import AnimatedBackground from './components/AnimatedBackground';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { LogOut, Home, User, Settings } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Load subscription
      const subs = await base44.entities.UserSubscription.filter({ user_email: currentUser.email });
      if (subs.length > 0) {
        setSubscription(subs[0]);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const showNav = currentPageName !== 'Home' && user;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {showNav && (
        <nav className="relative z-20 bg-white/40 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 font-bold text-xl text-gray-900">
                <Home className="h-5 w-5" />
                Nexus Developer AI
              </Link>
              
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('Pricing')}>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-white/60">
                    Pricing
                  </Button>
                </Link>
                <Link to={createPageUrl('Help')}>
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-white/60">
                    Help
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 border-2 border-indigo-600">
                        <AvatarFallback className="bg-indigo-600 text-white font-semibold">
                          {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.full_name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        {subscription && (
                          <p className="text-xs leading-none text-indigo-600 font-semibold mt-1">
                            {subscription.plan_name} Plan
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('Dashboard')} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl('AdminDashboard')} className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}