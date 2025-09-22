"use client";
import React, { useState } from 'react';
import { debugAPI, analyzeError, logger } from '../../lib/debug';

interface TestResult {
  ok?: boolean;
  error?: string | { type: string; message: string; solution: string };
  message?: string;
  type?: string;
  solution?: string;
  [key: string]: unknown;
}

export default function DebugPanel() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    logger.info('Starting comprehensive diagnostics...');

    try {
      const diagnosticResults = await debugAPI.runDiagnostics();
      setResults(diagnosticResults);
      logger.success('Diagnostics completed');
    } catch (error) {
      logger.error('Diagnostics failed', error);
      setResults({ error: analyzeError(error) });
    } finally {
      setIsRunning(false);
    }
  };

  const testIndividualEndpoint = async (endpoint: string) => {
    logger.info(`Testing ${endpoint} endpoint...`);

    try {
      let result;
      switch (endpoint) {
        case 'connection':
          result = await debugAPI.testConnection();
          break;
        case 'reports':
          result = await debugAPI.testReports();
          break;
        case 'upload':
          result = await debugAPI.testUpload();
          break;
        default:
          result = { error: 'Unknown endpoint' };
      }

      setResults(prev => ({ ...prev, [endpoint]: result }));
      logger.success(`${endpoint} test completed`);
    } catch (error) {
      logger.error(`${endpoint} test failed`, error);
      setResults(prev => ({ ...prev, [endpoint]: { error: analyzeError(error) } }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          🔧 Debug Panel
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Diagnose and troubleshoot Google Sheets integration issues
        </p>
      </div>

      {/* Main Diagnostics Button */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            🏥 System Diagnostics
          </h3>
        </div>

        <div className="p-4">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="btn btn-primary w-full"
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <div className="spinner"></div>
                Running Diagnostics...
              </span>
            ) : (
              '🔍 Run Full Diagnostics'
            )}
          </button>
        </div>
      </div>

      {/* Individual Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => testIndividualEndpoint('connection')}
          className="btn btn-secondary"
        >
          🔗 Test Connection
        </button>

        <button
          onClick={() => testIndividualEndpoint('reports')}
          className="btn btn-secondary"
        >
          📊 Test Reports
        </button>

        <button
          onClick={() => testIndividualEndpoint('upload')}
          className="btn btn-secondary"
        >
          📤 Test Upload
        </button>
      </div>

      {/* Results Display */}
      {Object.keys(results).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              📋 Test Results
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(results).map(([test, result]) => (
              <div key={test} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white capitalize">
                    {test} Test
                  </h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    result.ok
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {result.ok ? '✅ PASS' : '❌ FAIL'}
                  </span>
                </div>

                {result.ok ? (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    <pre className="bg-green-50 dark:bg-green-900/20 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    <div className="font-medium mb-1">
                      {result.type || 'Error'}: {result.message || (typeof result.error === 'string' ? result.error : JSON.stringify(result.error))}
                    </div>
                    {result.solution && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                          💡 Solution:
                        </div>
                        <div className="text-blue-700 dark:text-blue-300 whitespace-pre-line">
                          {result.solution}
                        </div>
                      </div>
                    )}
                    <pre className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs overflow-auto mt-2">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Issues Guide */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            🔍 Common Issues & Solutions
          </h3>
        </div>

        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200">
              Google Sheets Permission Error
            </h4>
            <p className="text-red-700 dark:text-red-300 text-sm">
              &quot;Exception: Unexpected error while getting the method or property openById on object SpreadsheetApp.&quot;
            </p>
            <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
              <li>• Ensure the Google Apps Script has edit access to the Google Sheet</li>
              <li>• Verify the Sheet ID in the Apps Script code is correct</li>
              <li>• Check if the Sheet exists and has not been deleted</li>
              <li>• Make sure the Apps Script is published with the correct version</li>
            </ul>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Network Connectivity Issues
            </h4>
            <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
              <li>• Check if the Apps Script URL is accessible</li>
              <li>• Ensure the Apps Script is published (not just saved)</li>
              <li>• Verify internet connectivity</li>
              <li>• Check for CORS configuration in the Apps Script</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
              Data Format Issues
            </h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Ensure Excel/CSV files have the correct column headers</li>
              <li>• Check that phone numbers are in a consistent format</li>
              <li>• Verify data types match what the Apps Script expects</li>
              <li>• Check for empty or invalid data in uploaded files</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
