/**
 * @file webpack renderer config
 * @author Gavin
 */

const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './src/renderer/index.ts',
    mode: isDevMode ? 'development' : 'production',
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue/,
                use: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(eot|woff|woff2|ttf)([\\?]?.*)$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        // https://vue-loader.vuejs.org/migrating.html#a-plugin-is-now-required
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/renderer/index.html',
            filename: 'index.html',
            title: 'electron-renderer-index'
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'renderer.bundle.js',
        path:  path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080
    }
};