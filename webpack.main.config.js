/**
 * @file webpack renderer config
 * @author yyc
 */

 const path = require('path');
 const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './src/main/index.ts',
    mode: isDevMode ? 'development' : 'production',
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.node/,
                use: 'node-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.node']
    },
    output: {
        filename: 'main.bundle.js',
        path:  path.resolve(__dirname, 'dist')
    }
};
 
 