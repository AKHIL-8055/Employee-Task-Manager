import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Profile from './Profile';
import AddNewTask from './AddNewTask';
import Pending from './Pending';
import Completed from './Completed';
import StartDate from './StartDate';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      const token = localStorage.getItem('token');
      if (!employeeId || !token) {
        throw new Error('No employee ID or token found. Please sign in again.');
      }

      const response = await fetch(`http://localhost:8080/tasks/employee/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeName');
    window.location.href = '/signin';
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-200 text-gray-800';
      case 'IN_PROGRESS': return 'bg-gray-300 text-gray-900';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700 border border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      fetchAllTasks(); // Refresh tasks
    } catch (err) {
      setError(err.message);
    }
  };

  const editTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setEditingTask(task);
    setShowEditModal(true);
  };

  const saveEditedTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/tasks/update/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingTask)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setShowEditModal(false);
      setEditingTask(null);
      fetchAllTasks(); // Refresh tasks
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask(prev => ({ ...prev, [name]: value }));
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete task');
        }

        fetchAllTasks(); // Refresh tasks
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'PENDING').length;
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length;
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(task => {
    const startDate = new Date(task.startDateTime).toDateString();
    const endDate = new Date(task.endDateTime).toDateString();
    return startDate === today || endDate === today;
  }).length;

  if (location.pathname !== '/home') {
    return (
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-task" element={<AddNewTask />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/start-date" element={<StartDate />} />
      </Routes>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Employee Task Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-200"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your tasks efficiently</p>
        </div>

        {error && (
          <div className="bg-gray-200 border border-gray-300 text-gray-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{todayTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100">
                <div className="w-6 h-6 bg-gray-400 rounded"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{completedTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/add-task"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200 group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Add New Task</span>
            </Link>

            <Link
              to="/pending"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition duration-200 group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Pending Tasks</span>
            </Link>

            <Link
              to="/completed"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition duration-200 group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Completed Tasks</span>
            </Link>

            <Link
              to="/start-date"
              className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition duration-200 group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tasks by Date</span>
            </Link>
          </div>
        </div>

        {/* All Tasks */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Tasks</h2>
            <button
              onClick={fetchAllTasks}
              className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-200"
            >
              Refresh
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Tasks Yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first task!</p>
              <Link
                to="/add-task"
                className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-200"
              >
                Add Your First Task
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } border border-gray-200`}
                >
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDateTime(task.startDateTime)} - {formatDateTime(task.endDateTime)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                      {task.status === 'PENDING' ? 'Pending' : task.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => editTask(task.id)}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Task</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingTask.description}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={editingTask.startDateTime.slice(0, 16)}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={editingTask.endDateTime.slice(0, 16)}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={editingTask.status}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedTask}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-800 transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/home"
            className="flex flex-col items-center text-gray-700"
          >
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/add-task"
            className="flex flex-col items-center text-gray-700"
          >
            <span className="text-xs mt-1">Add Task</span>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-700"
          >
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;