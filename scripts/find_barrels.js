/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

const fs = require('fs');
const path = require('path');

// Regex to match barrel file patterns
const BARREL_FILE_PATTERN =
  /^(import\s+\*.+from\s+['"].+['"];?\s*)*(export\s+(\*|{[^}]+})\s+from\s+['"].+['"];?\s*)+$/m;

function isBarrelFile(content) {
  return BARREL_FILE_PATTERN.test(content);
}

function findBarrelFiles(directory, barrelFiles = []) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      findBarrelFiles(fullPath, barrelFiles);
    } else if (
      (fullPath.endsWith('.ts') && !fullPath.endsWith('d.ts')) ||
      fullPath.endsWith('.tsx') ||
      fullPath.endsWith('.js') ||
      fullPath.endsWith('.jsx')
    ) {
      const content = fs.readFileSync(fullPath, 'utf-8').trim();
      if (isBarrelFile(content)) {
        barrelFiles.push(fullPath);
      }
    }
  }

  return barrelFiles;
}

// Usage example:
const folderToScan = path.resolve(process.argv[2] || '.'); // Pass folder as argument or use current directory
const barrelFiles = findBarrelFiles(folderToScan);

console.log('Barrel files found:', barrelFiles);
