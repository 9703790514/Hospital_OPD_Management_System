const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\Capstone\\cap-stone-frontned\\capstone-opd\\src';

// Get all files recursively
function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Extract imports from a file
function extractImports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = [];
    
    // Match import statements
    const importRegex = /import\s+(?:{[^}]*}|[\w*]+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        
        // Only process relative imports
        if (importPath.startsWith('./') || importPath.startsWith('../')) {
            imports.push(importPath);
        }
    }
    
    // Also match CSS imports
    const cssImportRegex = /import\s+['"]([^'"]+\.css)['"]/g;
    while ((match = cssImportRegex.exec(content)) !== null) {
        imports.push(match[1]);
    }
    
    return imports;
}

// Resolve import path to actual file
function resolveImport(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    let resolved = path.resolve(fromDir, importPath);
    
    // Try different extensions if not found
    if (!fs.existsSync(resolved)) {
        if (fs.existsSync(resolved + '.jsx')) {
            resolved = resolved + '.jsx';
        } else if (fs.existsSync(resolved + '.js')) {
            resolved = resolved + '.js';
        } else if (fs.existsSync(resolved + '.css')) {
            resolved = resolved + '.css';
        }
    }
    
    return resolved;
}

// Main analysis
console.log('Analyzing frontend src directory...\n');

const allFiles = getAllFiles(srcDir);
console.log(`Total files found: ${allFiles.length}\n`);

// Track which files are imported
const importedFiles = new Set();
const entryPoints = [
    path.join(srcDir, 'main.jsx'),
    path.join(srcDir, 'App.jsx')
];

// Add entry points as "imported"
entryPoints.forEach(entry => {
    if (fs.existsSync(entry)) {
        importedFiles.add(entry);
    }
});

// Build dependency graph
const visited = new Set();
function traverse(filePath) {
    if (visited.has(filePath)) return;
    visited.add(filePath);
    
    if (!fs.existsSync(filePath)) return;
    
    const imports = extractImports(filePath);
    
    imports.forEach(imp => {
        const resolvedPath = resolveImport(filePath, imp);
        if (fs.existsSync(resolvedPath)) {
            importedFiles.add(resolvedPath);
            traverse(resolvedPath);
        }
    });
}

// Traverse from entry points
entryPoints.forEach(entry => {
    if (fs.existsSync(entry)) {
        console.log(`Traversing from entry point: ${entry}`);
        traverse(entry);
    }
});

console.log(`\nFiles reachable from entry points: ${importedFiles.size}`);

// Find unused files
const unusedFiles = allFiles.filter(file => !importedFiles.has(file));

console.log(`\n${'='.repeat(60)}`);
console.log(`UNUSED FILES (${unusedFiles.length}):`);
console.log('='.repeat(60));

if (unusedFiles.length > 0) {
    unusedFiles.forEach(file => {
        const relativePath = path.relative(srcDir, file);
        console.log(`  - ${relativePath}`);
    });
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('SUMMARY:');
    console.log(`  Total files: ${allFiles.length}`);
    console.log(`  Used files: ${importedFiles.size}`);
    console.log(`  Unused files: ${unusedFiles.length}`);
    console.log('='.repeat(60));
} else {
    console.log('  No unused files found!');
}

// Save list to a file for review
const outputFile = 'd:\\Capstone\\unused-files.txt';
fs.writeFileSync(outputFile, unusedFiles.map(f => path.relative(srcDir, f)).join('\n'));
console.log(`\nUnused files list saved to: ${outputFile}`);
