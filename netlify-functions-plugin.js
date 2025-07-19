// netlify-functions-plugin.js
module.exports = {
  onPreBuild: async ({ utils }) => {
    console.log('Installing dependencies for Netlify Functions...');
    
    try {
      // Run npm install in the functions directory
      await utils.run.command('cd netlify/functions && npm install');
      console.log('✅ Successfully installed dependencies for functions');
    } catch (error) {
      console.error('❌ Failed to install dependencies for functions:', error);
      utils.build.failBuild('Failed to install dependencies for functions');
    }
  }
};
