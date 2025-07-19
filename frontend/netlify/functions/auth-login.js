// netlify/functions/auth-login.js
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
    // For now, bypass the backend and return a successful login response
    // This is a temporary workaround until backend routes are fixed
    
    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    const email = body.email || 'unknown@example.com';
    
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Login successful",
        token: "temporary-test-token-for-development",
        user: {
          id: "temp-user-id",
          email: email,
          name: "Test User",
          role: "admin"
        }
      })
    };
  } catch (error) {
    console.error('Auth login error:', error);
    
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Login failed",
        error: error.message
      })
    };
  }
};
