/**
 * @file webpack renderer config
 * @author Gavin
 */

 const path = require('path');
 const CopyPlugin = require("copy-webpack-plugin");
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
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: './src/main/dm.dll',
                    to: 'dm.dll'
                },
                {
                    from: './src/main/dm.zk.txt',
                    to: 'dm.zk.txt'
                }
            ]
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json', '.node']
    },
    output: {
        filename: 'main.bundle.js',
        path:  path.resolve(__dirname, 'dist')
    }
};
 
 