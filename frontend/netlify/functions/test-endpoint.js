// Simple test endpoint that returns a success response and debugging information

export function handler(event, context) {
  console.log("Test endpoint called:", event.path, event.httpMethod);

  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // For any other request method, return a simple response
  // Return a success response with debugging info
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "Test endpoint is working!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      netlifyEnvironment: process.env.NETLIFY || 'not-netlify',
      path: event.path,
      httpMethod: event.httpMethod,
      headers: event.headers,
      queryStringParameters: event.queryStringParameters || {},
      netlifyDeployUrl: process.env.DEPLOY_URL || 'local-development'
    }),
  };
}
