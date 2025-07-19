// netlify/functions/api-test.js
const axios = require('axios');

exports.handler = async function(event, context) {
  // Allow CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }
  
  try {
    // Get the backend URL from environment or use default
    const BACKEND_URL = process.env.BACKEND_API_URL || 'https://kcecell-backend-api.onrender.com';
    
    // Test different endpoints
    const testEndpoints = [
      { path: '/health', name: 'Health Check' },
      { path: '/health-api', name: 'Health API' },
      { path: '/auth-test', name: 'Auth Test' },
      { path: '/api/auth/login', name: 'Auth Login' },
      { path: '/api/auth', name: 'Auth Root' },
      { path: '/auth', name: 'Auth No Prefix' },
      { path: '/api', name: 'API Root' }
    ];
    
    // Run tests in parallel
    const results = await Promise.allSettled(testEndpoints.map(async endpoint => {
      try {
        const response = await axios.get(`${BACKEND_URL}${endpoint.path}`, {
          timeout: 5000,  // 5 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        return {
          endpoint: endpoint.name,
          path: endpoint.path,
          status: response.status,
          success: true,
          data: typeof response.data === 'object' ? response.data : { message: 'Non-JSON response' }
        };
      } catch (error) {
        return {
          endpoint: endpoint.name,
          path: endpoint.path,
          status: error.response?.status || 500,
          success: false,
          error: error.message,
          responseData: error.response?.data || null
        };
      }
    }));
    
    // Return results
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'API Test Results',
        backendUrl: BACKEND_URL,
        results: results,
      })
    };
  } catch (error) {
    console.error('API Test Error:', error);
    
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'API Test Failed',
        error: error.message
      })
    };
  }
};
