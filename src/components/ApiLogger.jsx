import React, { useState, useEffect, useMemo } from 'react';
import { getHttpLogs, clearHttpLogs } from '../utils/axios';

const ApiLogger = () => {
  const [logs, setLogs] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogs, setExpandedLogs] = useState({});
  const [sortBy, setSortBy] = useState('timestamp-desc');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      setLogs(getHttpLogs());
    } catch (error) {
      console.error('Failed to load logs:', error.message);
      setLogs([]);
    }
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        try {
          const newLogs = getHttpLogs();
          setLogs(prevLogs => {
            if (JSON.stringify(prevLogs) !== JSON.stringify(newLogs)) {
              return newLogs;
            }
            return prevLogs;
          });
        } catch (error) {
          console.error('Failed to refresh logs:', error.message);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleClearLogs = () => {
    try {
      clearHttpLogs();
      setLogs([]);
      setExpandedLogs({});
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to clear logs:', error.message);
    }
  };

  const toggleExpand = (logId) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    const searchLower = searchTerm.toLowerCase();
    return logs.filter(log => (
      (log.url && log.url.toLowerCase().includes(searchLower)) ||
      (log.method && log.method.toLowerCase().includes(searchLower)) ||
      (log.status && log.status.toString().includes(searchTerm)) ||
      (log.message && log.message.toLowerCase().includes(searchLower)) ||
      (log.type && log.type.toLowerCase().includes(searchLower))
    ));
  }, [logs, searchTerm]);

  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    if (sortBy === 'timestamp-desc') {
      return sorted;
    } else if (sortBy === 'timestamp-asc') {
      return sorted.reverse();
    } else if (sortBy === 'status') {
      return sorted.sort((a, b) => (a.status || 0) - (b.status || 0));
    }
    return sorted;
  }, [filteredLogs, sortBy]);

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800';
    if (status >= 500) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'request': return 'bg-blue-100 text-blue-800';
      case 'response': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">API Request Logger</h1>
            <p className="text-gray-600">Monitor all API calls</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search logs..."
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search API logs"
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
              aria-label="Sort logs"
            >
              <option value="timestamp-desc">Newest First</option>
              <option value="timestamp-asc">Oldest First</option>
              <option value="status">Status</option>
            </select>

            <button
              onClick={handleClearLogs}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center transition-colors"
              aria-label="Clear all logs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Logs
            </button>

            <label className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded text-blue-500 focus:ring-blue-500"
                aria-label="Toggle auto-refresh"
              />
              <span className="text-gray-700">Auto-refresh</span>
            </label>
          </div>
        </div>

        <div className="flex items-center text-xs font-semibold text-gray-500 mb-2 px-4">
          <div className="w-28">Time</div>
          <div className="w-16">Type</div>
          <div className="w-20">Method</div>
          <div className="w-16">Status</div>
          <div className="flex-1">URL</div>
          <div className="w-20">Details</div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {sortedLogs.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700">No logs found</h3>
              <p className="text-gray-500 mt-1">API requests to Server will appear here</p>
            </div>
          ) : (
            sortedLogs.map(log => (
              <div 
                key={log.id} 
                className={`bg-white border rounded-lg overflow-hidden transition-all duration-200 ${expandedLogs[log.id] ? 'shadow-md' : 'hover:shadow'}`}
              >
                <div 
                  className="grid grid-cols-1 md:grid-cols-[auto,auto,auto,auto,1fr,auto] items-start md:items-center gap-4 p-4 cursor-pointer"
                  onClick={() => toggleExpand(log.id)}
                >
                  <div className="text-sm font-medium text-gray-600 w-28">
                    {formatTime(log.timestamp)}
                  </div>
                  
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full w-16 text-center ${getTypeColor(log.type)}`}>
                    {log.type}
                  </div>
                  
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full w-20 text-center ${getMethodColor(log.method)}`}>
                    {log.method || 'N/A'}
                  </div>
                  
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full w-16 text-center ${getStatusColor(log.status)}`}>
                    {log.status || 'N/A'}
                  </div>
                  
                  <div className="truncate text-sm text-gray-700 font-medium">
                    {log.url}
                  </div>
                  
                  <div className="flex justify-end w-20">
                    <button 
                      className="text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(log.id);
                      }}
                      aria-label={expandedLogs[log.id] ? `Collapse log ${log.id}` : `Expand log ${log.id}`}
                    >
                      {expandedLogs[log.id] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedLogs[log.id] && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Details
                        </h3>
                        <div className="text-xs bg-white p-3 rounded-lg border">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="text-gray-500">Duration:</div>
                            <div className="font-medium">{log.duration || 'N/A'} ms</div>
                          </div>
                          {log.message && (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-gray-500">Message:</div>
                              <div className="font-medium text-red-600">{log.message}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {log.headers && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Headers
                          </h3>
                          <pre className="text-xs bg-white p-3 rounded-lg border max-h-32 overflow-auto">
                            {JSON.stringify(log.headers, null, 2).split('\n').slice(0, 50).join('\n')}
                            {JSON.stringify(log.headers, null, 2).split('\n').length > 50 && '... [TRUNCATED]'}
                          </pre>
                        </div>
                      )}
                      
                      {log.data && (
                        <div className="md:col-span-2">
                          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {log.type === 'request' ? 'Request Body' : 'Response Data'}
                          </h3>
                          <pre className="text-xs bg-white p-3 rounded-lg border max-h-64 overflow-auto">
                            {JSON.stringify(log.data, null, 2).split('\n').slice(0, 50).join('\n')}
                            {JSON.stringify(log.data, null, 2).split('\n').length > 50 && '... [TRUNCATED]'}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <div>
            Showing {sortedLogs.length} of {logs.length} logs
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Auto-refresh {autoRefresh ? 'on' : 'off'}
          </div>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Logs cleared successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiLogger;