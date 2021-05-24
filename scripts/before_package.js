/**
 * @file before package
 * @author Gavin
 */
const fs = require('fs-extra');
const path = require('path');

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
fs.removeSync(distDir);
fs.removeSync(outputDir);

// mkdir
fs.mkdirSync(distDir);
fs.mkdirSync(outputDir);

// add package.json
fs.writeFileSync(toFile, JSON.stringify(obj, null, 4), {
    encoding: 'utf-8'
});

