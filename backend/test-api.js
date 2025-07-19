#!/usr/bin/env node

// API endpoint tester script
const fetch = require('node-fetch');
const chalk = require('chalk');

// You might need to install these packages:
// npm install node-fetch chalk

const BASE_URL = 'http://localhost:5001';

async function testEndpoint(path, method = 'GET', body = null) {
  const url = `${BASE_URL}${path}`;
  console.log(chalk.yellow(`Testing ${method} ${url}`));
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.text();
    let jsonData;
    
    try {
      jsonData = JSON.parse(data);
      console.log(chalk.green(`Status: ${response.status}`));
      console.log(chalk.cyan('Response:'), jsonData);
    } catch (e) {
      console.log(chalk.green(`Status: ${response.status}`));
      console.log(chalk.cyan('Response (text):'), data.substring(0, 200) + (data.length > 200 ? '...' : ''));
    }
    
    return { status: response.status, data: jsonData || data };
  } catch (error) {
    console.log(chalk.red(`Error: ${error.message}`));
    return { status: 'error', error: error.message };
  }
}

async function runTests() {
  console.log(chalk.magenta('=== E-Cell API Test Suite ==='));
  
  // Test root endpoint
  await testEndpoint('/');
  
  // Test health endpoint
  await testEndpoint('/health');
  
  // Test the health-api endpoint we added
  await testEndpoint('/health-api');
  
  // Test auth-test endpoint we added
  await testEndpoint('/auth-test');
  
  // Test login endpoint
  await testEndpoint('/api/auth/login', 'POST', {
    email: 'admin@example.com',
    password: 'password123'
  });
  
  // Test other API endpoints
  await testEndpoint('/api/auth');
  await testEndpoint('/api/users');
  await testEndpoint('/api/events');
  
  console.log(chalk.magenta('=== Tests Completed ==='));
}

// Run the tests
runTests().catch(err => {
  console.error(chalk.red('Test suite error:'), err);
});
