import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
    
    const projectData = await base44.entities.Project.filter(
      { created_by: userData.email },
      '-updated_date'
    );
    setProjects(projectData);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'complete': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      complete: 'bg-green-50 text-green-700 border-0',
      in_progress: 'bg-blue-50 text-blue-700 border-0',
      draft: 'bg-gray-100 text-gray-700 border-0'
    };
    
    return (
      <Badge variant="secondary" className={`${variants[status]} px-2 py-1 rounded text-xs`}>
        {getStatusIcon(status)}
        <span className="ml-1">{status.replace('_', ' ')}</span>
      </Badge>
    );
  };

  const stats = {
    total: projects.length,
    complete: projects.filter(p => p.status === 'complete').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    draft: projects.filter(p => p.status === 'draft').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6 sm:mb-8 bg-white border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.06)] rounded-2xl overflow-hidden">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex items-start justify-between flex-wrap gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-5">
                <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {user?.full_name || 'User'}
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 truncate max-w-[200px] sm:max-w-none">{user?.email}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant="secondary"
                      className="rounded-full px-2 sm:px-3 text-xs bg-purple-50 text-purple-700 border-0"
                    >
                      {user?.role || 'user'}
                    </Badge>
                    {user?.created_date && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        Since {format(new Date(user.created_date), 'MMM yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="text-center px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl flex-1 sm:flex-none">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Total Projects</div>
                </div>
                <div className="hidden sm:flex gap-4 md:gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.complete}</div>
                    <div className="text-gray-500 text-xs">Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                    <div className="text-gray-500 text-xs">In Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              AI Prompt Agent - Plan your app like a developer
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link to="/Templates" className="flex-1 sm:flex-none">
              <Button variant="outline" className="gap-2 w-full text-sm sm:text-base">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Templates</span>
              </Button>
            </Link>
            <Link to="/Examples" className="flex-1 sm:flex-none">
              <Button variant="outline" className="gap-2 w-full text-sm sm:text-base">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Examples</span>
              </Button>
            </Link>
            <Link to="/NewProject" className="flex-1 sm:flex-none">
              <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2 w-full text-sm sm:text-base">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">New Plan</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8"
        >
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.complete}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">{stats.draft}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-purple-50 rounded-xl mb-4">
                  <FileText className="h-12 w-12 text-purple-400" />
                </div>
                <p className="text-gray-600 mb-6">No projects yet. Ready to build something amazing?</p>
                <Link to="/NewProject">
                  <Button className="bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <Link
                    key={project.id}
                    to={`/${project.status === 'complete' ? 'ProjectResult' : 'NewProject'}?id=${project.id}`}
                  >
                    <div className="group p-4 bg-white border border-gray-100 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all duration-200 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            {project.niche && (
                              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                                {project.niche}
                              </span>
                            )}
                            <span className="text-gray-400 text-xs">Updated {format(new Date(project.updated_date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>

        {user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <Link to="/AdminDashboard">
              <Button variant="outline" className="rounded-lg border-gray-200 hover:bg-gray-50">
                View Admin Dashboard
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}