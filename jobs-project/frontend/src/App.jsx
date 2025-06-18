import React, { useState, useEffect } from 'react';

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [backendUrl, setBackendUrl] = useState('http://localhost:3000');
  const [collections, setCollections] = useState({
    users: { data: null, loaded: false, loading: false },
    customers: { data: null, loaded: false, loading: false },
    jobs: { data: null, loaded: false, loading: false },
    pipelines: { data: null, loaded: false, loading: false }
  });
  const [stats, setStats] = useState({
    users: '-',
    customers: '-',
    jobs: '-',
    pipelines: '-'
  });

  // Load dashboard statistics
  const loadDashboardStats = async () => {
    const collectionNames = ['users', 'customers', 'jobs', 'pipelines'];
    const newStats = { ...stats };

    for (const collection of collectionNames) {
      try {
        const response = await fetch(`${backendUrl}/api/${collection}`);
        if (response.ok) {
          const data = await response.json();
          const count = Array.isArray(data) ? data.length : (data.count || 0);
          newStats[collection] = count;
        } else {
          newStats[collection] = '?';
        }
      } catch (error) {
        newStats[collection] = '!';
      }
    }
    setStats(newStats);
  };

  // Load specific collection data
  const loadCollectionData = async (collectionName) => {
    setCollections(prev => ({
      ...prev,
      [collectionName]: { ...prev[collectionName], loading: true }
    }));

    try {
      const response = await fetch(`${backendUrl}/api/${collectionName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setCollections(prev => ({
        ...prev,
        [collectionName]: { data, loaded: true, loading: false }
      }));
    } catch (error) {
      setCollections(prev => ({
        ...prev,
        [collectionName]: { 
          data: null, 
          loaded: true, 
          loading: false, 
          error: error.message 
        }
      }));
    }
  };

  // Handle section changes
  const showSection = (sectionName) => {
    setActiveSection(sectionName);
    if (sectionName === 'dashboard') {
      loadDashboardStats();
    }
  };

  const showCollection = (collectionName) => {
    setActiveSection(collectionName);
    if (!collections[collectionName].loaded && !collections[collectionName].loading) {
      loadCollectionData(collectionName);
    }
  };

  // Format values for display
  const formatValue = (value) => {
    if (value === null || value === undefined) {
      return <em>null</em>;
    }
    if (typeof value === 'object') {
      return <pre className="object-display">{JSON.stringify(value, null, 2)}</pre>;
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    return String(value);
  };

  // Reset collections when backend URL changes
  useEffect(() => {
    setCollections({
      users: { data: null, loaded: false, loading: false },
      customers: { data: null, loaded: false, loading: false },
      jobs: { data: null, loaded: false, loading: false },
      pipelines: { data: null, loaded: false, loading: false }
    });
    if (activeSection === 'dashboard') {
      loadDashboardStats();
    }
  }, [backendUrl]);

  // Load dashboard on initial render
  useEffect(() => {
    if (activeSection === 'dashboard') {
      loadDashboardStats();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600">
      <style jsx>{`
        .object-display {
          background: #f8f9fa;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="bg-white bg-opacity-95 backdrop-blur-lg shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MongoDB Dashboard
            </div>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => showSection('dashboard')}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeSection === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:transform hover:-translate-y-1'
                }`}
              >
                Dashboard
              </button>
              {['users', 'customers', 'jobs', 'pipelines'].map((collection) => (
                <button
                  key={collection}
                  onClick={() => showCollection(collection)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 capitalize ${
                    activeSection === collection
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:transform hover:-translate-y-1'
                  }`}
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Backend URL Configuration */}
        <div className="bg-white bg-opacity-90 rounded-xl p-4 mb-6 backdrop-blur-sm">
          <label className="block mb-2 font-semibold text-gray-700">Backend URL:</label>
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="http://localhost:3000"
          />
        </div>

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-xl backdrop-blur-lg">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
              MongoDB Collections Overview
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {['users', 'customers', 'jobs', 'pipelines'].map((collection) => (
                <div key={collection} className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                  <div className="text-3xl font-bold mb-2">{stats[collection]}</div>
                  <div className="text-sm uppercase tracking-wide opacity-90 capitalize">
                    {collection}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-gray-600">
              <p className="text-lg mb-2">Click on a collection in the navigation to view data</p>
              <p className="text-sm">Update the Backend URL above to match your server</p>
            </div>
          </div>
        )}

        {/* Collection Data Sections */}
        {['users', 'customers', 'jobs', 'pipelines'].includes(activeSection) && (
          <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-xl backdrop-blur-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
              {activeSection} Collection
            </h2>

            {collections[activeSection].loading && (
              <div className="text-center py-8 text-gray-600 text-lg">
                Loading...
              </div>
            )}

            {collections[activeSection].error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                <strong>Error loading {activeSection}:</strong><br />
                {collections[activeSection].error}<br /><br />
                <small>
                  Make sure your backend is running and the URL is correct.<br />
                  Common endpoints: /api/{activeSection} or /{activeSection}
                </small>
              </div>
            )}

            {collections[activeSection].loaded && !collections[activeSection].loading && !collections[activeSection].error && (
              <div>
                {!collections[activeSection].data || (Array.isArray(collections[activeSection].data) && collections[activeSection].data.length === 0) ? (
                  <div className="text-center py-8 text-gray-600 text-lg">
                    No data found
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {(Array.isArray(collections[activeSection].data) ? collections[activeSection].data : [collections[activeSection].data]).map((item, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <h4 className="text-lg font-semibold mb-4 capitalize">
                          {activeSection.slice(0, -1)} #{index + 1}
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(item).map(([key, value]) => (
                            key !== '__v' && (
                              <div key={key} className="flex flex-col sm:flex-row">
                                <span className="font-medium text-gray-700 sm:w-1/4 mb-1 sm:mb-0">
                                  {key}:
                                </span>
                                <span className="text-gray-600 sm:w-3/4">
                                  {formatValue(value)}
                                </span>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!collections[activeSection].loaded && !collections[activeSection].loading && (
              <div className="text-center py-8 text-gray-600 text-lg">
                Click to load {activeSection} data...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;