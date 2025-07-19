// netlify/functions/auth-login.js
exports.handler = async function(event, context) {
  console.log('Auth Login Function Called:', event.path, event.httpMethod);
  
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
    
    console.log('Processing login request in auth-login function');
    
    // Parse the request body
    const body = JSON.parse(event.body || '{}');
    const email = body.email || 'unknown@example.com';
    const password = body.password || '';
    
    console.log(`Login attempt for email: ${email}`);
    
    // Test user credentials for development
    const testUsers = [
      { email: 'admin@ecell.com', password: 'adminpass', role: 'admin', name: 'Admin User' },
      { email: 'student@ecell.com', password: 'studentpass', role: 'student', name: 'Student User' },
      { email: 'test@example.com', password: 'testpass', role: 'user', name: 'Test User' }
    ];
    
    // Find matching test user
    const matchedUser = testUsers.find(user => 
      user.email === email && user.password === password
    );
    
    if (matchedUser) {
      console.log(`Test user found: ${matchedUser.name} (${matchedUser.role})`);
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "Login successful",
          token: `temp-token-${Date.now()}-${matchedUser.role}`,
          user: {
            id: `user-${matchedUser.email.split('@')[0]}`,
            email: matchedUser.email,
            name: matchedUser.name,
            role: matchedUser.role
          }
        })
      };
    }
    
    // If no matching test user, return authentication error
    console.log('No matching test user found');
    return {
      statusCode: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Authentication failed",
        error: "Invalid email or password"
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
