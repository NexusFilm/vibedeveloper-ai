import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, Search, TrendingUp, Users, FileText, DollarSign, Megaphone, Tag, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newPlan, setNewPlan] = useState({ name: '', price: 0, billing_period: 'monthly', project_limit: 0, features: [] });
  const [newDiscount, setNewDiscount] = useState({ code: '', type: 'percentage', value: 0, max_uses: 0 });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'info' });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = allProjects.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.niche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.created_by?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(allProjects);
    }
  }, [searchTerm, allProjects]);

  const loadData = async () => {
    const userData = await base44.auth.me();
    setUser(userData);

    if (userData.role !== 'admin') {
      alert('Access denied. Admin only.');
      return;
    }

    const projects = await base44.entities.Project.list('-updated_date');
    setAllProjects(projects);
    setFilteredProjects(projects);

    const plans = await base44.entities.PricingPlan.list();
    setPricingPlans(plans);

    const codes = await base44.entities.Discount.list();
    setDiscounts(codes);

    const msgs = await base44.entities.Announcement.list('-priority');
    setAnnouncements(msgs);
  };

  const toggleFeatured = async (project) => {
    await base44.entities.Project.update(project.id, {
      is_featured: !project.is_featured
    });
    loadData();
  };

  const handleCreatePlan = async () => {
    if (!newPlan.name || !newPlan.price) {
      alert('Please fill in all required fields');
      return;
    }
    await base44.entities.PricingPlan.create(newPlan);
    setNewPlan({ name: '', price: 0, billing_period: 'monthly', project_limit: 0, features: [] });
    loadData();
  };

  const handleUpdatePlan = async (plan, updates) => {
    await base44.entities.PricingPlan.update(plan.id, updates);
    loadData();
  };

  const handleDeletePlan = async (planId) => {
    if (confirm('Delete this pricing plan?')) {
      await base44.entities.PricingPlan.delete(planId);
      loadData();
    }
  };

  const handleCreateDiscount = async () => {
    if (!newDiscount.code || !newDiscount.value) {
      alert('Please fill in code and value');
      return;
    }
    await base44.entities.Discount.create(newDiscount);
    setNewDiscount({ code: '', type: 'percentage', value: 0, max_uses: 0 });
    loadData();
  };

  const handleDeleteDiscount = async (discountId) => {
    if (confirm('Delete this discount?')) {
      await base44.entities.Discount.delete(discountId);
      loadData();
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      alert('Please fill in title and message');
      return;
    }
    await base44.entities.Announcement.create(newAnnouncement);
    setNewAnnouncement({ title: '', message: '', type: 'info' });
    loadData();
  };

  const handleToggleAnnouncement = async (announcement) => {
    await base44.entities.Announcement.update(announcement.id, {
      is_active: !announcement.is_active
    });
    loadData();
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (confirm('Delete this announcement?')) {
      await base44.entities.Announcement.delete(announcementId);
      loadData();
    }
  };

  const stats = {
    total: allProjects.length,
    complete: allProjects.filter(p => p.status === 'complete').length,
    featured: allProjects.filter(p => p.is_featured).length,
    uniqueUsers: new Set(allProjects.map(p => p.created_by)).size
  };

  const nicheBreakdown = allProjects.reduce((acc, p) => {
    if (p.niche) {
      acc[p.niche] = (acc[p.niche] || 0) + 1;
    }
    return acc;
  }, {});

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Access denied. Admin only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to="/Dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8">Manage pricing, discounts, announcements, and projects</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.complete}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.featured}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{stats.uniqueUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Niche Analytics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Popular Niches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(nicheBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([niche, count]) => (
                  <Badge key={niche} variant="secondary" className="text-sm">
                    {niche}: {count}
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, niche, or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Student Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredProjects.map(project => (
                    <div
                      key={project.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{project.title}</h3>
                            {project.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>by {project.created_by}</span>
                            {project.niche && (
                              <Badge variant="secondary" className="text-xs">
                                {project.niche}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              {project.status}
                            </Badge>
                            <span>{format(new Date(project.updated_date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={project.is_featured ? "default" : "outline"}
                            onClick={() => toggleFeatured(project)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            {project.is_featured ? 'Featured' : 'Feature'}
                          </Button>
                          {project.status === 'complete' && (
                            <Link to={`/ProjectResult?id=${project.id}`}>
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Plan */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3">Create New Plan</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input 
                      placeholder="Plan name (e.g., Free, Pro)" 
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    />
                    <Input 
                      type="number" 
                      placeholder="Price ($)" 
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({...newPlan, price: parseFloat(e.target.value)})}
                    />
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newPlan.billing_period}
                      onChange={(e) => setNewPlan({...newPlan, billing_period: e.target.value})}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                    <Input 
                      type="number" 
                      placeholder="Project limit (0 = unlimited)" 
                      value={newPlan.project_limit}
                      onChange={(e) => setNewPlan({...newPlan, project_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  <Input 
                    placeholder="Features (comma-separated)" 
                    value={newPlan.features.join(', ')}
                    onChange={(e) => setNewPlan({...newPlan, features: e.target.value.split(',').map(f => f.trim())})}
                    className="mb-3"
                  />
                  <Button onClick={handleCreatePlan} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Plan
                  </Button>
                </div>

                {/* Existing Plans */}
                {pricingPlans.map(plan => (
                  <div key={plan.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <p className="text-2xl font-bold text-indigo-600">${plan.price}/{plan.billing_period}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant={plan.is_featured ? 'default' : 'outline'}
                          onClick={() => handleUpdatePlan(plan, { is_featured: !plan.is_featured })}
                        >
                          {plan.is_featured ? 'Featured' : 'Feature'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Projects: {plan.project_limit === 0 ? 'Unlimited' : plan.project_limit}
                    </p>
                    {plan.features?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {plan.features.map((f, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Discount Codes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Discount */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3">Create New Discount</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input 
                      placeholder="Code (e.g., SAVE20)" 
                      value={newDiscount.code}
                      onChange={(e) => setNewDiscount({...newDiscount, code: e.target.value.toUpperCase()})}
                    />
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      value={newDiscount.type}
                      onChange={(e) => setNewDiscount({...newDiscount, type: e.target.value})}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <Input 
                      type="number" 
                      placeholder={newDiscount.type === 'percentage' ? 'Discount %' : 'Discount $'} 
                      value={newDiscount.value}
                      onChange={(e) => setNewDiscount({...newDiscount, value: parseFloat(e.target.value)})}
                    />
                    <Input 
                      type="number" 
                      placeholder="Max uses (0 = unlimited)" 
                      value={newDiscount.max_uses}
                      onChange={(e) => setNewDiscount({...newDiscount, max_uses: parseInt(e.target.value)})}
                    />
                  </div>
                  <Button onClick={handleCreateDiscount} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Discount
                  </Button>
                </div>

                {/* Existing Discounts */}
                {discounts.map(discount => (
                  <div key={discount.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg font-mono">{discount.code}</h3>
                        <p className="text-gray-600">
                          {discount.type === 'percentage' ? `${discount.value}% off` : `$${discount.value} off`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Used: {discount.current_uses || 0} / {discount.max_uses === 0 ? '∞' : discount.max_uses}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteDiscount(discount.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Announcement */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-3">Create New Announcement</h3>
                  <Input 
                    placeholder="Title" 
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    className="mb-3"
                  />
                  <Textarea 
                    placeholder="Message" 
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                    className="mb-3"
                  />
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm mb-3 w-full"
                    value={newAnnouncement.type}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="update">Update</option>
                  </select>
                  <Button onClick={handleCreateAnnouncement} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Announcement
                  </Button>
                </div>

                {/* Existing Announcements */}
                {announcements.map(announcement => (
                  <div key={announcement.id} className={`p-4 border rounded-lg ${
                    announcement.is_active ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                            {announcement.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{announcement.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-700">{announcement.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleAnnouncement(announcement)}
                        >
                          {announcement.is_active ? 'Disable' : 'Enable'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}