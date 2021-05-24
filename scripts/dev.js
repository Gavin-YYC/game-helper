/**
 * @file dev
 * @author Gavin
 */

const path = require('path');
const kill = require('tree-kill');
const electron = require('electron');
const childProcess = require('child_process');

let electronProcess = null;

async function killElectron() {
    const pid = electronProcess && electronProcess.pid || '';
    if (pid) {
        return new Promise((resolve, reject) => {
            if (pid) {
                kill(pid, 'SIGKILL', (err) => {
                    if (err) reject(err);
                    resolve();
                })
            }
            else {
                resolve();
            }
        })
    }
}

async function restartElectron() {
    console.log('Starting electron...');
    await killElectron();
    electronProcess = childProcess.spawn(electron, [
        path.join(__dirname, '../dist')
    ]);

    electronProcess.stdout.on('data', data => {
        console.log(data.toString());
    });

    electronProcess.stderr.on('data', data => {
        console.log(data.toString());
    });

    electronProcess.on('exit', (code, signal) => {
        console.log('Electron exit', code, signal);
        if (code !== 1) {
            process.exit();
        }
    });
}

async function startRenderer() {
    return new Promise(resolve => {
        const pro = childProcess.spawn('npm', ['run', 'dev:renderer'], {
            cwd: process.cwd(),
            shell: true
        });
    
        pro.stdout.on('data', data => {
            const str = data.toString();
            console.log(str.replace('\n', ''));

            if (str.includes('successfully')) {
                resolve();
            }
        });
    });
}

async function startMain() {
    const pro = childProcess.spawn('npm', ['run', 'dev:main'], {
        cwd: process.cwd(),
        shell: true
    });

    pro.stdout.on('data', async data => {
        const str = data.toString();
        console.log(str.replace('\n', ''));
        if (str.includes('successfully')) {
            await restartElectron();
        }
    });
}

async function main() {
    await startRenderer();
    startMain();
}

main();
