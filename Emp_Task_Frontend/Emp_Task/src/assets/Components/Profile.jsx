import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeeProfile();
  }, []);

  const fetchEmployeeProfile = async () => {
    try {
      // Get ID from localStorage
      const employeeId = localStorage.getItem('employeeId');
      const token = localStorage.getItem('token');

      if (!employeeId || !token) {
        setError('No employee ID or token found in localStorage');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }

      const employeeData = await response.json();
      setEmployee(employeeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-gray-200 border border-gray-300 rounded-lg p-6 max-w-md w-full">
          <div className="text-gray-700 text-center">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Employee Profile</h1>
          <p className="mt-2 text-gray-600">View your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-8">
            <div className="flex items-center justify-center">
              <div className="bg-white rounded-full p-2">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {employee?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white text-center">
              {employee?.name || 'No Name'}
            </h2>
            <p className="text-gray-300 text-center mt-1">Employee</p>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* ID Field */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Employee ID</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    #{employee?.id || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
              </div>

              {/* Name Field */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    {employee?.name || 'Not provided'}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    {employee?.email || 'Not provided'}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Password Field (masked) */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Password</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-800">
                    ••••••••
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-2">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;