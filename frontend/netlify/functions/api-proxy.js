// netlify/functions/api-proxy.js
const axios = require('axios');

// The actual backend URL - using environment variable or hardcoded backup
const BACKEND_URL = process.env.BACKEND_API_URL || 'https://kcecell-backend-api.onrender.com';

exports.handler = async function(event, context) {
  console.log('API Proxy Handler Invoked: ', event.path, event.httpMethod);
  
  // Get the path and HTTP method from the incoming request
  const path = event.path.replace('/.netlify/functions/api-proxy', '');
  const method = event.httpMethod.toLowerCase();
  const headers = event.headers;
  const queryParams = event.queryStringParameters || {};
  
  // Allow CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };
  
  // Handle preflight OPTIONS request
  if (method === 'options') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }
  
  try {
    // Forward the request to the backend API
    // Special case for health check - use a known working endpoint
    let url;
    if (path === '/auth/health' || path === '/api/auth/health') {
      url = `${BACKEND_URL}/health`;
    } else {
      const adjustedPath = path.replace(/^\/api/, '');
      url = `${BACKEND_URL}/api${adjustedPath}`;
    }
    
    // Add more detailed debug logging
    console.log(`API Proxy Debug:
      Original path: "${path}"
      Adjusted path: "${adjustedPath}"
      Backend URL: "${BACKEND_URL}"
      Full URL: "${url}"
      HTTP Method: "${method.toUpperCase()}"
    `);
    
    // Filter out headers that might cause issues
    const filteredHeaders = { ...headers };
    delete filteredHeaders.host;
    delete filteredHeaders['x-forwarded-for'];
    delete filteredHeaders['x-forwarded-proto'];
    delete filteredHeaders['x-forwarded-port'];
    delete filteredHeaders['x-country'];
    
    // Add Authorization header if it exists in the original request
    if (event.headers.authorization) {
      filteredHeaders.authorization = event.headers.authorization;
    }
    
    // Set up request options
    const requestOptions = {
      method: method,
      headers: filteredHeaders,
      url: url,
      params: queryParams,
      // Only include a body for non-GET/HEAD requests
      ...(method !== 'get' && method !== 'head' && event.body 
          ? { data: JSON.parse(event.body) } 
          : {})
    };
    
    // Make the request to the backend
    const response = await axios(requestOptions);
    
    // Return the response from the backend
    return {
      statusCode: response.status,
      headers: { 
        ...corsHeaders,
        'Content-Type': response.headers['content-type'] || 'application/json'
      },
      body: typeof response.data === 'object' 
        ? JSON.stringify(response.data) 
        : response.data
    };
  } catch (error) {
    console.error('Error proxying to backend:', error);
    console.error(`Request details: ${method.toUpperCase()} ${path} to ${BACKEND_URL}/api${path.replace(/^\/api/, '')}`);
    
    // Add more detailed error logging
    console.error(`Error Details:
      Status: ${error.response?.status || 'No status'}
      Message: ${error.message}
      URL: ${url}
      Request Headers: ${JSON.stringify(filteredHeaders)}
      Request Body: ${event.body ? event.body : 'No body'}
    `);
    
    // Return the error response from the backend if available
    if (error.response) {
      return {
        statusCode: error.response.status,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: typeof error.response.data === 'object' 
          ? JSON.stringify(error.response.data) 
          : error.response.data || JSON.stringify({ message: error.message })
      };
    }
    
    // Return a generic error if no response from backend
    return {
      statusCode: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Internal Server Error', 
        error: error.message 
      })
    };
  }
};
