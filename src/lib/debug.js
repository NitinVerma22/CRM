// lib/debug.js - Debugging utilities for Google Sheets integration

export const debugAPI = {
  // Test Google Apps Script connectivity
  testConnection: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL}?action=test`);
      const data = await response.json();
      console.log('🔗 Google Apps Script Connection Test:', data);
      return data;
    } catch (error) {
      console.error('❌ Google Apps Script Connection Failed:', error);
      return { ok: false, error: error.message };
    }
  },

  // Test reports endpoint
  testReports: async () => {
    try {
      const response = await fetch('/api?action=reports');
      const data = await response.json();
      console.log('📊 Reports API Test:', data);
      return data;
    } catch (error) {
      console.error('❌ Reports API Failed:', error);
      return { ok: false, error: error.message };
    }
  },

  // Test upload endpoint with sample data
  testUpload: async () => {
    const testData = {
      leads: [
        {
          "Business Name": "Test Business",
          "Address": "123 Test Street",
          "Phone Number": "555-0123"
        }
      ]
    };

    try {
      const response = await fetch('/api?action=upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      console.log('📤 Upload API Test:', data);
      return data;
    } catch (error) {
      console.error('❌ Upload API Failed:', error);
      return { ok: false, error: error.message };
    }
  },

  // Run all diagnostic tests
  runDiagnostics: async () => {
    console.log('🔍 Starting API Diagnostics...');

    const results = {
      connection: await debugAPI.testConnection(),
      reports: await debugAPI.testReports(),
      upload: await debugAPI.testUpload()
    };

    console.log('📋 Diagnostic Results:', results);
    return results;
  }
};

// Error analysis helper
export const analyzeError = (error) => {
  const errorString = error.toString().toLowerCase();

  if (errorString.includes('spreadsheetapp')) {
    return {
      type: 'Google Sheets Permission Error',
      message: 'The Google Apps Script cannot access the Google Sheet. Check permissions and Sheet ID.',
      solution: '1. Ensure the Apps Script has edit access to the Google Sheet\n2. Verify the Sheet ID in the Apps Script code\n3. Check if the Sheet exists and is not deleted'
    };
  }

  if (errorString.includes('fetch')) {
    return {
      type: 'Network Error',
      message: 'Cannot connect to Google Apps Script',
      solution: '1. Check if the Apps Script URL is correct\n2. Ensure the Apps Script is published and accessible\n3. Check network connectivity'
    };
  }

  if (errorString.includes('cors')) {
    return {
      type: 'CORS Error',
      message: 'Cross-origin request blocked',
      solution: '1. Configure CORS in the Google Apps Script\n2. Use a proxy server if needed'
    };
  }

  return {
    type: 'Unknown Error',
    message: error.message,
    solution: 'Check the browser console for more details'
  };
};

// Console logging utilities
export const logger = {
  info: (message, data) => {
    console.log(`ℹ️ ${message}`, data || '');
  },

  success: (message, data) => {
    console.log(`✅ ${message}`, data || '');
  },

  error: (message, error) => {
    console.error(`❌ ${message}`, error || '');
  },

  warn: (message, data) => {
    console.warn(`⚠️ ${message}`, data || '');
  }
};
