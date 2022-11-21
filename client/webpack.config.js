const path = require('path');
const Config = require('./config/index');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

/**
 * Webpack config
 */
module.exports = {
    watch: true,
    target: 'web',
    mode: 'development',
    stats: 'none',

    performance: {
        hints: false
    },

    entry: {
        index: './src/index-users.js',
        admin: './src/index-admin.js',
    },
    resolve: {
        fallback: { 
            "os": false,
            "path": false,
            "querystring": false,
            "stream": false,
            "zlib": false,
            "buffer": false,
            "stream": false,
            "crypto": false,
            "url": false,
            "assert": false,
            "util": false,
            "url": false,
            "http": false,
            "https": false,
            "tls": false,
            "child_process": false,
            "fs": false,
            "net": false
        }
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
                                relativeUrls: false
                            }
                        }
                    }
                ],
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
        static: {
            directory: path.join(__dirname, 'public'),
        },
        liveReload: true,

        compress: true,
        port: Config.port,
        //watchContentBase: true,
        // contentBase: path.join(__dirname, 'public'),
        devMiddleware: {
            writeToDisk: true,
            publicPath: '/'
        },

        historyApiFallback: true
    },

    optimization: {
        minimize: true,
    minimizer: [new TerserPlugin()],
    },
};