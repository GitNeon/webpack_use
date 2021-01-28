const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
      app: './src/index.js',
      test: './src/js/test.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.css/,
            // 这个 loader 取代 style-loader。作用：提取 js 中的 css 成单独文件
            use: [MiniCssExtractPlugin.loader, 'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: ['postcss-preset-env']
                        }
                        // ident: 'post-css',
                        // plugins: () => [
                        //     // postcss 的插件
                        //     require('postcss-preset-env')()
                        // ]
                    }
                }]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                // 预设：指示 babel 做怎么样的兼容性处理
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            // 按需加载
                            useBuiltIns: 'usage',
                            // 指定 core-js 版本
                            corejs: {
                                version: 3
                            },
                            // 指定兼容性做到哪个版本浏览器
                            targets: {
                                chrome: '60',
                                firefox: '60',
                                ie: '9',
                                safari: '10',
                                edge: '17'
                            }
                        }
                    ]
                ]
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/html/index.html'
        }),
        // 提取css
        new MiniCssExtractPlugin({
            // 对输出的 css 文件进行重命名
            filename: 'css/build.css'
        }),
        // 压缩css
        new OptimizeCssAssetsWebpackPlugin()
    ]
};