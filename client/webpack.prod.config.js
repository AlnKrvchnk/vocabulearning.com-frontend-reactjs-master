const path = require('path');
const Config = require('./config/index');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

/**
 * Webpack config
 */
module.exports = {
    watch: false,
    target: 'web',
    mode: 'production',

    entry: {
        index: './src/index-users.js',
        admin: './src/index-admin.js'
    },
    
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].bundle.js',
        publicPath: '/public/'
    },

    watchOptions: {
        poll: 500,
        ignored: /node_modules/
    },
    

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
               

                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                relativeUrls: false,
                                javascriptEnabled: true,
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|png|gif|svg|ttf|eot|gif|woff)$/, 
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            }
        ],
    },

    devServer: {
        publicPath: '/',
        compress: true,
        port: Config.port,
        writeToDisk: true,
        watchContentBase: true,
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true
    }
};