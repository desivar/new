import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

function DashboardPage() {
  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalJobs: 47,
      activeJobs: 23,
      completedJobs: 18,
      totalRevenue: 125000,
      totalCustomers: 34,
      pipelineValue: 89000
    },
    recentJobs: [
      { id: 1, title: 'Website Redesign', customer: 'Tech Corp', status: 'In Progress', value: 5000, dueDate: '2025-06-15' },
      { id: 2, title: 'Mobile App Development', customer: 'StartupXYZ', status: 'Planning', value: 15000, dueDate: '2025-07-01' },
      { id: 3, title: 'SEO Optimization', customer: 'Local Business', status: 'Completed', value: 2500, dueDate: '2025-06-10' },
      { id: 4, title: 'Database Migration', customer: 'Enterprise Inc', status: 'In Progress', value: 8000, dueDate: '2025-06-20' }
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 25000 },
      { month: 'May', revenue: 28000 },
      { month: 'Jun', revenue: 17000 }
    ],
    jobsByStatus: [
      { name: 'In Progress', value: 23, color: '#3b82f6' },
      { name: 'Completed', value: 18, color: '#10b981' },
      { name: 'Planning', value: 6, color: '#f59e0b' }
    ],
    upcomingDeadlines: [
      { job: 'Website Redesign', customer: 'Tech Corp', dueDate: '2025-06-15', daysLeft: 6 },
      { job: 'Database Migration', customer: 'Enterprise Inc', dueDate: '2025-06-20', daysLeft: 11 },
      { job: 'Mobile App Development', customer: 'StartupXYZ', dueDate: '2025-07-01', daysLeft: 22 }
    ]
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your jobs.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.totalJobs}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.activeJobs}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.completedJobs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.metrics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.metrics.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.metrics.pipelineValue)}</p>
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs by Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Jobs by Status</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.jobsByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {dashboardData.jobsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Jobs and Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  Add Job
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.recentJobs.map((job) => (
                <div key={job.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.customer}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                        <span className="text-sm text-gray-600">{formatCurrency(job.value)}</span>
                        <span className="text-sm text-gray-600">Due: {job.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {dashboardData.upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">{deadline.job}</h4>
                      <p className="text-sm text-gray-600">{deadline.customer}</p>
                      <p className="text-sm text-gray-600 mt-1">Due: {deadline.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deadline.daysLeft <= 7 ? 'bg-red-100 text-red-800' : 
                        deadline.daysLeft <= 14 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {deadline.daysLeft} days
                      </span>
                      {deadline.daysLeft <= 7 && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">New Job</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Add Customer</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-6 w-6 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;