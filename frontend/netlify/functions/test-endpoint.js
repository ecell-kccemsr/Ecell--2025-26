// Simple test endpoint that returns a success response

export function handler(event, context) {
  console.log('Test endpoint called:', event.path, event.httpMethod);
  
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // For any other request method, return a simple response
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: 'Test endpoint working!',
      timestamp: new Date().toISOString(),
      path: event.path,
      method: event.httpMethod,
      queryParams: event.queryStringParameters || {},
      headers: event.headers
    })
  };
}
