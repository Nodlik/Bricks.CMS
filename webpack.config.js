const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const npm_package = require('./package.json');

module.exports = {
    entry: './apps/client/src/index.tsx',
    resolve: {
        alias: {
            '@apps': path.resolve(__dirname, 'apps'),
            '@libs': path.resolve(__dirname, 'libs'),
            '@client': path.resolve(__dirname, 'apps/client/src'),
        },
        extensions: ['.ts', '.tsx', '.js'],
    },
    mode: 'development',
    optimization: {
        minimizer: [new TerserPlugin({})],
    },
    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: './apps/client/public/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { configFile: 'tsconfig.webpack.json' },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    node: { fs: 'empty' },
    target: 'web',
    output: {
        publicPath: '/',
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, 'apps/client/dist/'),
    },
    devServer: {
        host: '0.0.0.0',
        contentBase: path.join(__dirname, 'apps/client/dist/'),
        port: 3000,
        historyApiFallback: true,
    },
};
