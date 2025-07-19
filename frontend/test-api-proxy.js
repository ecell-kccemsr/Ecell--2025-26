// test-api-proxy.js
// A simple test script to verify the API proxy configuration

const axios = require('axios');

// Test configuration
const NETLIFY_SITE = 'https://kcecell001.netlify.app';
const DIRECT_BACKEND = 'https://kcecell-backend-api.onrender.com';
const TEST_ENDPOINT = '/auth/login';

// Helper function to format responses for output
function formatResponse(res) {
  return {
    status: res.status,
    headers: {
      'content-type': res.headers['content-type'],
      'access-control-allow-origin': res.headers['access-control-allow-origin'],
    },
    data: typeof res.data === 'object' ? res.data : 'Non-JSON response'
  };
}

async function runTests() {
  console.log('🧪 API Proxy Test');
  console.log('==================\n');

  try {
    // Test 1: Direct Backend API call
    console.log(`🔍 Test 1: Direct Backend Call`);
    try {
      const directRes = await axios.get(`${DIRECT_BACKEND}/api${TEST_ENDPOINT}`);
      console.log(`✅ Status: ${directRes.status}`);
      console.log(`Response:`, formatResponse(directRes));
    } catch (error) {
      console.log(`❌ Error:`, error.message);
      if (error.response) {
        console.log(`Response:`, formatResponse(error.response));
      }
    }
    
    console.log('\n---\n');

    // Test 2: Netlify API Proxy call 
    console.log(`🔍 Test 2: Netlify API Proxy Call`);
    try {
      const proxyRes = await axios.get(`${NETLIFY_SITE}/api${TEST_ENDPOINT}`);
      console.log(`✅ Status: ${proxyRes.status}`);
      console.log(`Response:`, formatResponse(proxyRes));
    } catch (error) {
      console.log(`❌ Error:`, error.message);
      if (error.response) {
        console.log(`Response:`, formatResponse(error.response));
      }
    }
    
    console.log('\n---\n');

    // Test 3: Netlify Function Direct call
    console.log(`🔍 Test 3: Direct Netlify Function Call`);
    try {
      const functionRes = await axios.get(`${NETLIFY_SITE}/.netlify/functions/api-proxy${TEST_ENDPOINT}`);
      console.log(`✅ Status: ${functionRes.status}`);
      console.log(`Response:`, formatResponse(functionRes));
    } catch (error) {
      console.log(`❌ Error:`, error.message);
      if (error.response) {
        console.log(`Response:`, formatResponse(error.response));
      }
    }
    
  } catch (error) {
    console.error('❌ Test script error:', error);
  }
}

// Run the tests
runTests();
