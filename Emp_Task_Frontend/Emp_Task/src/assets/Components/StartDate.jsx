import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StartDate = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const fetchTasksByStartDate = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const employeeId = localStorage.getItem('employeeId');
      const token = localStorage.getItem('token');
      if (!employeeId || !token) {
        throw new Error('No employee ID or token found. Please sign in again.');
      }

      // Format date to match backend expectation (YYYY-MM-DD)
      const formattedDate = selectedDate;

      const response = await fetch(`http://localhost:8080/tasks/startdate/${formattedDate}/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks for the selected date');
      }

      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-200 text-gray-700';
      case 'IN_PROGRESS': return 'bg-gray-300 text-gray-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-600 border border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Tasks by Start Date</h1>
            <p className="mt-2 text-gray-600">Find tasks that start on a specific date</p>
          </div>
          <Link
            to="/home"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Date Selection Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={fetchTasksByStartDate} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Select Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition duration-200 bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                'Search Tasks'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-gray-200 border border-gray-300 text-gray-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tasks starting on {new Date(selectedDate).toLocaleDateString()}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`rounded-lg shadow-sm overflow-hidden border-l-4 border-gray-500 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } border border-gray-200`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'PENDING' ? 'PENDING' : task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : 'COMPLETED'}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 mb-4">{task.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Starts: {formatDateTime(task.startDateTime)}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Ends: {formatDateTime(task.endDateTime)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedDate && tasks.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Tasks Found</h3>
            <p className="text-gray-600">No tasks found starting on {new Date(selectedDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartDate;