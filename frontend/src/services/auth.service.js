const handleAuth = async (endpoint, data) => {
  try {
    const response = await fetch(`/api/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Authentication failed');
    }

    return responseData;
  } catch (error) {
    console.error(`Auth error (${endpoint}):`, error);
    throw error;
  }
};

export const authService = {
  login: (credentials) => handleAuth('login', credentials),
  forgotPassword: (email) => handleAuth('forgot-password', { email }),
  resetPassword: (token, password) => handleAuth('reset-password', { token, password }),
  verifyEmail: (token) => handleAuth('verify-email', { token }),
};
