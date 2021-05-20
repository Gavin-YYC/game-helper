/**
 * @file dev
 * @author Gavin
 */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

let firstDev = false;

// First: start renderer process
const dev = childProcess.spawn('npm', ['run', 'dev:renderer'], {
    cwd: process.cwd(),
    shell: true
});

dev.stdout.on('data', data => {
    const str = data.toString();
    console.log(str.replace('\n', ''));

    // Second: Start electron
    if (str.includes('Compiled successfully.') && !firstDev) {
        console.log('构建成功，正在启动客户端');
        firstDev = true;
        const start = childProcess.spawn('npm', ['run', 'dev:main'], {
            cwd: process.cwd(),
            shell: true
        });
        start.stdout.on('data', data => {
            console.log(data.toString().replace('\n', ''));
        });
    }
});