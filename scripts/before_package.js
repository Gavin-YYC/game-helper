/**
 * @file before package
 * @author yyc
 */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const pkg = path.join(__dirname, '..', 'package.json');
const distDir = path.join(__dirname, '../dist');
const outputDir = path.join(__dirname, '../output');
const toFile = path.join(distDir, 'package.json');
const json = JSON.parse(fs.readFileSync(pkg, {encoding: 'utf-8'}));

const obj = {
    name: json.name,
    author: json.author,
    version: json.version,
    description: json.description,
    productName: json.productName,
    main: './main.bundle.js'
};

// clean output dir
childProcess.execSync(`rm -rf ${distDir}`);
childProcess.execSync(`rm -rf ${outputDir}`);

// mkdir
childProcess.execSync(`mkdir ${distDir}`);
childProcess.execSync(`mkdir ${outputDir}`);

// add package.json
fs.writeFileSync(toFile, JSON.stringify(obj, null, 4), {
    encoding: 'utf-8'
});

