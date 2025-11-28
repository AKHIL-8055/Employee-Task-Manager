import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Completed = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const employeeId = localStorage.getItem('employeeId');
      const token = localStorage.getItem('token');
      if (!employeeId || !token) {
        throw new Error('No employee ID or token found. Please sign in again.');
      }

      const response = await fetch(`http://localhost:8080/tasks/completed/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completed tasks');
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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please sign in again.');
      }

      // First, get the current task data
      const getResponse = await fetch(`http://localhost:8080/tasks/employee/${localStorage.getItem('employeeId')}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!getResponse.ok) {
        throw new Error('Failed to fetch task data');
      }

      const allTasks = await getResponse.json();
      const currentTask = allTasks.find(task => task.id === taskId);

      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Update the status
      const updatedTask = { ...currentTask, status: newStatus };

      // Send the full task object
      const response = await fetch(`http://localhost:8080/tasks/update/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask)
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      // Refresh the tasks list
      fetchCompletedTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please sign in again.');
      }

      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      // Refresh the tasks list
      fetchCompletedTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading completed tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Completed Tasks</h1>
            <p className="mt-2 text-gray-600">Tasks you've successfully completed</p>
          </div>
          <Link
            to="/home"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-gray-200 border border-gray-300 text-gray-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Completed Tasks</h3>
            <p className="text-gray-600">No completed tasks found. Start completing your tasks!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`rounded-lg shadow-sm overflow-hidden border-l-4 border-gray-400 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } border border-gray-200`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium border border-gray-300">
                      COMPLETED
                    </span>
                  </div>
                  
                  <p className="text-gray-800 mb-4">{task.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Started: {formatDateTime(task.startDateTime)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Completed: {formatDateTime(task.endDateTime)}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => updateTaskStatus(task.id, 'PENDING')}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Mark as Pending
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;