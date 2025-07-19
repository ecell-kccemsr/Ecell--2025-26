const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Directory to scan
const rootDir = __dirname;

// Function to check if a JavaScript file has syntax errors
function checkFileSyntax(filePath) {
  return new Promise((resolve) => {
    exec(`node --check ${filePath}`, (error) => {
      if (error) {
        console.log(`❌ Syntax error in ${filePath}`);
        resolve({ file: filePath, hasError: true });
      } else {
        resolve({ file: filePath, hasError: false });
      }
    });
  });
}

// Function to recursively find all .js files
function findJsFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(findJsFiles(fullPath));
    } else if (path.extname(item) === ".js") {
      results.push(fullPath);
    }
  }

  return results;
}

// Main function
async function main() {
  console.log("Scanning for JavaScript syntax errors...");
  const jsFiles = findJsFiles(rootDir);
  console.log(`Found ${jsFiles.length} JavaScript files`);

  const results = await Promise.all(jsFiles.map(checkFileSyntax));
  const errors = results.filter((r) => r.hasError);

  if (errors.length === 0) {
    console.log("✅ No syntax errors found!");
  } else {
    console.log(`❌ Found ${errors.length} files with syntax errors:`);
    errors.forEach((err) => console.log(" - " + err.file));
  }
}

main().catch(console.error);
