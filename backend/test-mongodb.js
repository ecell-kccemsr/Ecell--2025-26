require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Test');
console.log('==========================');
console.log('Environment:', process.env.NODE_ENV);

// Extract connection details without revealing password
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  const uriParts = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.*)/);
  if (uriParts) {
    console.log('🔗 Connection Details:');
    console.log('  Protocol: mongodb+srv');
    console.log('  Username:', uriParts[1]);
    console.log('  Password: ********** (length:', uriParts[2].length, ')');
    console.log('  Host:', uriParts[3]);
    console.log('  Database:', uriParts[4].split('?')[0]);
  }
} else {
  console.log('❌ No MONGODB_URI found in environment variables');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('\n🔄 Attempting to connect...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📁 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);
    console.log('📊 Ready State:', mongoose.connection.readyState); // 1 = connected
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:');
    console.log('   Error Code:', error.code);
    console.log('   Error Name:', error.codeName);
    console.log('   Message:', error.message);
    
    if (error.code === 8000) {
      console.log('\n🚨 Authentication Error Solutions:');
      console.log('   1. Check if the username and password are correct');
      console.log('   2. Verify the database user exists in MongoDB Atlas');
      console.log('   3. Check IP whitelist (most common issue)');
      console.log('   4. Ensure user has proper permissions');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testConnection();
