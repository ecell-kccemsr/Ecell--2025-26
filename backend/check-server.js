const https = require('https');

const url = 'https://ecell-2025-26-api.onrender.com';

console.log(`Checking server at ${url}...`);

// Function to make a request
const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    https.get(`${url}${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`\n✅ Endpoint: ${path}`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        console.log(`Response: ${data.substring(0, 500)}${data.length > 500 ? '...' : ''}\n`);
        resolve({ statusCode: res.statusCode, data });
      });
    }).on('error', (err) => {
      console.error(`\n❌ Error checking ${path}: ${err.message}\n`);
      reject(err);
    });
  });
};

// Check multiple endpoints
const checkEndpoints = async () => {
  try {
    await makeRequest('/');
    await makeRequest('/health');
    await makeRequest('/api/auth');
    console.log('Server check completed');
  } catch (error) {
    console.error('Failed to check server:', error);
  }
};

checkEndpoints();
