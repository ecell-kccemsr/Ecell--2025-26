// check-routes.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const routesDir = path.join(__dirname, 'routes');

console.log('🔍 Checking routes for syntax errors...');

// Get all JS files in the routes directory
fs.readdir(routesDir, (err, files) => {
  if (err) {
    console.error('❌ Error reading routes directory:', err.message);
    return;
  }
  
  const jsFiles = files.filter(file => file.endsWith('.js'));
  console.log(`Found ${jsFiles.length} route files`);
  
  let checkedCount = 0;
  let errorCount = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(routesDir, file);
    
    exec(`node --check ${filePath}`, (error) => {
      checkedCount++;
      
      if (error) {
        console.error(`❌ Syntax error in ${file}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ ${file} - Syntax OK`);
      }
      
      // When all files have been checked
      if (checkedCount === jsFiles.length) {
        console.log('\n=== Summary ===');
        console.log(`Total files checked: ${jsFiles.length}`);
        console.log(`Files with errors: ${errorCount}`);
        if (errorCount === 0) {
          console.log('✅ All route files have valid syntax!');
        } else {
          console.log('❌ Some route files have syntax errors.');
        }
      }
    });
  });
});
