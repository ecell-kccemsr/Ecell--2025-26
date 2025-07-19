// Create a mock auth handler for testing

const authUsers = [
  {
    email: "admin@ecell.com",
    password: "adminpass",
    name: "Admin User",
    role: "admin",
  },
  {
    email: "user@ecell.com",
    password: "userpass",
    name: "Regular User",
    role: "user",
  },
];

function authenticateUser(email, password) {
  const user = authUsers.find((user) => user.email === email);
  if (!user) return null;
  if (user.password !== password) return null;

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function handler(event, context) {
  // Log the request
  console.log(
    `Auth Function - Method: ${event.httpMethod}, Path: ${event.path}`
  );

  // Handle OPTIONS preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // Handle login request
  if (event.httpMethod === "POST") {
    try {
      // Parse request body
      const requestBody = JSON.parse(event.body);
      const { email, password } = requestBody;

      console.log(`Login attempt for: ${email}`);

      // Try to authenticate
      const user = authenticateUser(email, password);

      if (user) {
        // Success - return token and user info
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            message: "Login successful",
            token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
            user,
          }),
        };
      } else {
        // Failed authentication
        return {
          statusCode: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            message: "Invalid email or password",
          }),
        };
      }
    } catch (error) {
      console.error("Error processing login:", error);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Server error processing login",
          error: error.message,
        }),
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "Method not allowed",
    }),
  };
}
