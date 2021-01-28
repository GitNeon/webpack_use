### Webpack（一）：基础使用

****

文章有参看其他博主文章，本文章仅作用于简单回顾使用，不能作为新手入门教程

- http://www.woc12138.com/article/45
- https://segmentfault.com/a/1190000006178770
- https://www.cnblogs.com/joyco773/p/9049693.html
- https://www.jianshu.com/p/941bfaf13be1/
- https://www.cnblogs.com/minghui007/p/7390247.html

#### 一、概念

##### 1.什么是webpack

&ensp;&ensp;WebPack可以看做是**模块打包机**：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。

- webpack 是一种**前端资源构建工具**，一个静态模块打包器(module bundler)
- 在webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理
- 它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)

##### 2.webpack的工作方式

Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。

![](F:\前端笔记与资料\webpack\笔记\png\webpack-01.png)

看下面一张图

![](F:\前端笔记与资料\webpack\笔记\png\webpack-04.png)

看这个图就很明白了：

1. 对于一份同逻辑的代码，当我们手写下一个一个的文件，它们无论是 ESM 还是 commonJS 或是 AMD，他们都是 **module** ；
2. 当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 **chunk** 文件，webpack 会对这个 chunk 文件进行一些操作；
3. webpack 处理好 chunk 文件后，最后会输出 **bundle** 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

一般来说一个 chunk 对应一个 bundle，比如上图中的 `utils.js -> chunks 1 -> utils.bundle.js`；但也有例外，比如说上图中，我就用 `MiniCssExtractPlugin` 从 chunks 0 中抽离出了 `index.bundle.css` 文件。

**总结就是：**`module`，`chunk` 和 `bundle` 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：

我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

##### 3.webpack的5个核心概念

| 概念    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| Entry   | 入口(Entry)：指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图 |
| Output  | 输出(Output)：指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名 |
| Loader  | 加载器(Loader)：让 webpack 能够去处理那些非 JS 的文件，比如样式文件、图片文件(webpack 自身只理解JS) |
| Plugins | 插件(Plugins)：可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，<br/>一直到重新定义环境中的变量等。 |
| Mode    | 模式(Mode)：指示 webpack 使用相应模式的配置                  |

Mode模式：

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| development | 将 process.env.NODE_ENV 的值设置为 development。此模式是能让代码本地调试运行的环境。<br>启用的插件：NamedChunksPlugin 和 NamedModulesPlugin |
| production  | 将process.env.NODE_ENV 的值设置为 production。能让代码优化上线运行的环境<br>启用的插件：FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 TerserPlugin。 |

#### 二、基本入门

##### 1.初始化配置

初始化 package.json：npm init

```js
npm init
```

##### 2.安装依赖

webpack4以上的版本需要全局/本地安装webpack-cli

全局安装：

```js
npm install webpack webpack-cli -g
```

在当前项目目录安装：

```js
npm install --save webpack webpack-cli
```

##### 3.创建项目

项目基本目录结构如下：

![](F:\前端笔记与资料\webpack\笔记\png\webpack-02.png)

创建一个index.js文件作为入口文件，放在src目录下：

```js
// 先只打印一行内容
console.log('初次使用webpack');
```

然后使用命令进行编译：

```js
// 这行命令的意思就是:
// 编译  这个目录        输出到  这个目录下      使用环境为开发环境
webpack ./src/index.js -o ./build/built.js --mode=development
// 注意：新版的webpack输出目录可以不指定文件名，默认会生成一个main.js
webpack ./src/index.js -o ./build --mode=development
```

最后在build目录下生成了一个main.js

```js
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements:  */
eval("console.log('初次使用webpack');\n\n//# sourceURL=webpack://webpack_use/./src/index.js?");
/******/ })();
```

总结：

- webpack 本身能处理 js/json 资源，不能处理 css/img 等其他资源

- 生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化，但是不能处理 ES6 的基本语法转化为 ES5（需要借助 loader）
- 生产环境会压缩js代码，而开发环境更多的是调试信息

#### 三、webpack开发环境的配置

上面的步骤仅仅是只处理了js代码，由于webpack自身就能编译处理基本的js资源，所以无需额外的配置，但是如果处理css,img等就需要loader或者plugin了

##### 1.wepack的配置文件

webpack.config.js 是 webpack 的配置文件，作用：

- 指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）

- 所有构建工具都是基于 nodejs 平台运行的，模块化默认采用 commonjs。

- 配置文件的命名必须是webpack.config.js，也许在未来的版本可能会支持自定义命名

##### 2.开发环境的配置方面

开发环境配置主要是为了能让代码运行，并获得更多的调试信息。主要考虑以下几个方面：

- 打包样式资源
- 打包 html 资源
- 打包图片资源
- 打包其他资源
- devServer

##### 3.处理各项资源

###### 3.1打包JS资源

创建webpack.config.js文件，位于项目根目录下，然后配置一下选项

```js
// 引入Node核心模块path,用来处理路径
const path = require ('path');

module.exports = {
    // 指定入口文件
    entry: './src/index.js',
    // 输出配置参数
    output: {
        // 输出的文件名
        filename: 'main.js',
        // 输出路径
        path: path.resolve(__dirname,'build/js')
    },
    // 指定运行环境
    mode: 'development'
};
```

使用webpack命令进行编译，可以看到成功的编译了js文件，无需任何配置

![](F:\前端笔记与资料\webpack\笔记\png\webpack-03.png)

###### 3.2打包css资源

在css目录下新建一个mystyle.css文件，然后输入一下代码

```css
div {
    width: 200px;
    height: 200px;
    background-color: skyblue;
}
```

在index.js中引入css样式

```js
import './css/mystyle.css'
```

安装css-loader,style-loader,此loader可以处理css资源，不安装会导致编译报错

```js
npm install --save css-loader style-loader
```

修改webpack.config.js，增加module参数

```js
module.exports = {
    ...
    // loader选项配置
    module: {
        rules: [{
            // 表示要处理css资源，匹配css文件名后缀
            test: /\.css/,
            // 要使用的loader,注意：这里loader的执行顺序为数组的倒序
            // 使用多个Loader用use声明
            use:['style-loader','css-loader']
        }]
    }
}
```

当控制台输出webpack  compiled successfully in 315 ms，说明打包css资源成功

同样的打包less资源需要引入Less-loader即可

```js
// 使用命令安装less-loader
npm install --save less=loader
```

```js
// 修改webpack配置项
module.export = {
    ...
   // loader选项配置
    module: {
        rules: [
            ...
            ,{
            // 匹配Less文件
            test: /\.less/,
            //使用less-loader
            use:['less-loader']
        }]
    }
}
```

###### 3.3打包html资源

在html文件夹下新建一个index.html，里面不需要放置任何内容

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>

</body>
</html>
```

安装html-webpack-plugin

```js
npm install --save html-webpack-plugin
```

修改配置文件

```js
// 引入插件
const htmlWebpackPlugin = require('html-webpack-plugin');
// 创建插件并指定模板
module.exports = {
    ...
    // 插件配置参数
    plugins:[
        new htmlWebpackPlugin({
            template: './src/html/index.html'
        })
    ]
}
```

然后执行webpack命令，打包完成后到build目录下查看index.html，发现已经自动引入了js文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
	<script src="main.js"></script>
</body>
</html>
```

所以这个插件的作用就是帮助我们自动引入Js,css等，无需手动引入

###### 3.4打包图片资源

在index.html中引入图片

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <img src="../images/Angel.png" alt="">
</body>
</html>
```

由于在html中引入img图片在编译后会发生路径错误问题，导致解析不到图片，所以需要借助Loader来帮助我们处理图片资源

安装html-loader,url-loader,file-loader

```js
npm install --save html-loader url-loader file-loader
```

配置loader

```js
module.export = {
    ...,
    modules:{
    	rules:[{
    		...,
    		// 配置loader
    		{
    			test: /\.(jpg|png|gif)$/,
    			// 这里可以使用url-loader,也可以选择file-loader
    			loader: 'url-loader',
    			// loader的配置参数
    			options:{
    				// 图片小于8kb就会被转换为Base64编码
    				limit: 8*1024,
    				// 因为 url-loader默认使用es6 模块化解析，而 html-loader引入图片是 commonjs
    				// 解析时会出问题：[object Module]
    				// 关闭 url-loader 的 es6 模块化，使用 commonjs 解析
   					esModule: false,
    				// 给图片重命名
    				name: '[hash:10].[ext]'
				}
			},{
                test:/\.html/,
                // 处理 html 文件的 img 图片（负责引入 img，从而能被 url-loader 进行处理）
                loader: 'html-loader'
            }
		}]
	}
}
```

若出现Automatic publicPath is not supported in this browser错误，则需要配置打包后公共资源的路径

```js
// 在webpack.config.js文件中添加
module.exports = 
{
    ...,
    output: {
    	...,
        publicPath: './'
    }
}
```

然后使用webpack命令编译完后运行build目录下的index.html,发现图片已经正常显示了

###### 3.5打包其他资源

打包其他资源需要借助file-loader，比我我们需要打包ttf字体文件，字体图标等

新建一个font文件夹，存放ttf字体图标文件，修改html文件，引入字体图标

```html
<!-- 打包其他资源 -->
<span class="iconfont icon-icon-test"></span>
<span class="iconfont icon-icon-test2"></span>
<span class="iconfont icon-icon-test3"></span>
<span class="iconfont icon-icon-test1"></span>
```

修改配置文件

```js
module.export = {
    ...,
    modules:{
    	rules:[{
    		...,
    		// 新增文件处理loader
    		{
    			// 排除哪些文件不受处理
                exclude: /\.(css|js|html|jpg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]'
                }
        	}
    	]
	}
}
```

###### 3.6devServer参数

devServer用来配置开发时环境的一些配置参数

| 参数        | 说明               |
| ----------- | ------------------ |
| contentBase | 项目构建后的路径   |
| compress    | 启用gzip压缩       |
| port        | 指定的端口号       |
| open        | 是否自动打开浏览器 |

在webpack.config.js中声明即可

```js
module.export = {
    ...,
    mode:'development',
    devServer: {
        // 项目构建后路径
        contentBase: resolve(__dirname, 'build'),
        // 启动 gzip 压缩
        compress: true,
        // 端口号
        port: 3000,
        // 自动打开浏览器
        open: true
	}
}
```

##### 4.完整的配置文件

```js
// 引入Node核心模块path,用来处理路径
const path = require ('path');
// 引入html插件
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 指定入口文件
    entry: './src/index.js',
    // 输出配置
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname,'build'),
        publicPath: './'
    },
    // loader选项配置
    module: {
        rules: [{
            // 表示要处理css资源，匹配css文件名后缀
            test: /\.css/,
            // 要使用的loader,注意：这里loader的执行顺序为数组的倒序
            use:['style-loader','css-loader']
        },{
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 8*1024,
                esModule: false,
                name: '[hash:10].[ext]'
            }
        },{
            test: /\.html/,
            loader: 'html-loader'
        },{
            exclude: /\.(css|js|html|jpg|png|gif)$/,
            loader: 'file-loader',
            options: {
                name: '[hash:10].[ext]'
            }
        }]
    },
    // 插件配置参数
    plugins: [
        new htmlWebpackPlugin({
            template: './src/html/index.html'
        })
    ],
    mode: 'development',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        compress: true,
        port: 3000,
        open: true
    }
};
```

#### 四、webpack生产环境的配置

前面说了开发环境的配置，本小节内容再来看看生产环境需要考虑的配置有哪写方面

- 提取 css 成单独文件
- css 兼容性处理
- 压缩 css
- js 语法检查
- js 兼容性处理
- js 压缩
- html 压缩

##### 1.提取css为单独文件

安装插件

```js
npm install --save  mini-css-extract-plugin
```

配置文件中引入mini-css-extract-plugin插件就好

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.js',
    output:{
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: './'
    },
    module: {
        rules:[{
            test:/\.css/,
            // 这个 loader 取代 style-loader。作用：提取 js 中的 css 成单独文件
            use:[MiniCssExtractPlugin.loader,'css-loader']
        }]
    },
    plugins:[
        // 自动帮我们引入js,css
        new HtmlWebpackPlugin({
            template: './src/html/index.html'
        }),
        new MiniCssExtractPlugin({
            // 对输出的 css 文件进行重命名
            filename: 'css/build.css'
        })
    ]
};
```

##### 2.css的兼容性处理

通过postcss-loader加载器，可以帮助我们自动生成兼容不同浏览器的css代码，也就是加前缀

使用以下命令安装loader

```js
npm install --save postcss-loader postcss-preset-env
```

修改配置文件

```js
module.exports = {
    ...,
        module: {
        rules:[{
            test:/\.css/,
            // 这个 loader 取代 style-loader。作用：提取 js 中的 css 成单独文件
            use:[MiniCssExtractPlugin.loader,'css-loader',
                {	
    				// 加载postcss-loader
                    loader: 'postcss-loader',
                    options: {
    					// 选项参数，这个是新版写法，下面那个是老版本写法
                        postcssOptions:{
                            plugins: ['postcss-preset-env']
                        }
                        // ident: 'post-css',
                        // plugins: () => [
                        //     // postcss 的插件
                        //     require('postcss-preset-env')()
                        // ]
                    }
                }]
        }]
    }
}
```

修改package.json

```js
{
    ...,
  // 增加以下代码
  "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
}
```

css里这么写

```css
.box {
    width: 100px;
    height: 80px;
    background-color: darkseagreen;
    backface-visibility: visiable;
}
```

使用webpack命令编译后的css

```css
.box {
    width: 100px;
    height: 80px;
    background-color: darkseagreen;
    -webkit-backface-visibility: visible;
            backface-visibility: visible;
}
```

可以看出，已经帮我们自动生成前缀了

##### 3.压缩css

安装插件

```js
npm install --save optimize-css-assets-webpack-plugin
```

修改配置文件

```js
// 1.引入插件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 2.加载插件
module.exports = {
    ...,
    plugins:[
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
}
```

使用webpack命令编译后，查看编译后的css文件，发现已经压缩成一行了

##### 4.js语法检查

启用eslint语法检查，安装以下loader:

```js
npm install --save eslint-loader eslint eslint-config-airbnb-base eslint-plugin-import
```

修改配置文件

```js
module.exports = {
    ...,
        rules:[
        	{
                test: /\.js/,
    			// 排除此目录
                exclude:/node_modules/,
                loader: 'eslint-loader',
                options:{
    				// 自动修复错误
                    fix:true
                }
        }]
}
```

修改Package.json，增加以下代码即可

```js
"eslintConfig": {
    "extends": "airbnb-base",
    "env": {
      "browser": true
    }
  }
```

##### 5.js兼容性处理

有些ES6语法不能被识别，所以应该转换为兼容的Es5语法，比如Promise,这时应该使用babel-loader进行处理

安装loader:

```js
// babel-loader @babel/core @babel/preset-env这几个loader只能进行基本的语法转换
// @babel/polyfill能进行全部的js兼容性处理
npm install --save babel-loader @babel/core @babel/preset-env @babel/polyfill core-js
```

修改配置文件

```js
module.exports = {
    ...,
        rules:[{
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
}
```

##### 6.html的压缩

我们上述已经安装过了html-webpack-plugin插件，修改参数即可

```js
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        // 压缩 html 代码
        minify: {
            // 移除空格
            collapseWhitespace: true,
            // 移除注释
            removeComments: true
        }
    })
]
```

#### 五、完整的配置文件

##### 1.简单的开发环境webpack.confg.js配置文件

```js
// resolve用来拼接绝对路径的方法
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引用plugin

module.exports = {
  // webpack配置
  entry: './src/js/index.js', // 入口起点
  output: {
    // 输出
    // 输出文件名
    filename: 'js/build.js',
    // __dirname是nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build'), // 输出路径，所有资源打包都会输出到这个文件夹下
  },
  // loader配置
  module: {
    rules: [
      // 详细的loader配置
      // 不同文件必须配置不同loader处理
      {
        // 匹配哪些文件
        test: /\.less$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左，从下到上，依次执行(先执行css-loader)
          // style-loader：创建style标签，将js中的样式资源插入进去，添加到head中生效
          'style-loader',
          // css-loader：将css文件变成commonjs模块加载到js中，里面内容是样式字符串
          'css-loader',
          // less-loader：将less文件编译成css文件，需要下载less-loader和less
          'less-loader'
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // url-loader：处理图片资源，问题：默认处理不了html中的img图片
        test: /\.(jpg|png|gif)$/,
        // 需要下载 url-loader file-loader
        loader: 'url-loader',
        options: {
          // 图片大小小于8kb，就会被base64处理，优点：减少请求数量（减轻服务器压力），缺点：图片体积会更大（文件请求速度更慢）
          // base64在客户端本地解码所以会减少服务器压力，如果图片过大还采用base64编码会导致cpu调用率上升，网页加载时变卡
          limit: 8 * 1024,
          // 给图片重命名，[hash:10]：取图片的hash的前10位，[ext]：取文件原来扩展名
          name: '[hash:10].[ext]',
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是conmonjs，解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          outputPath: 'imgs',
        },
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader',
      },
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // 排除html|js|css|less|jpg|png|gif文件
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        // file-loader：处理其他文件
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media',
        },
      },
    ],
  },
  // plugin的配置
  plugins: [
    // html-webpack-plugin：默认会创建一个空的html文件，自动引入打包输出的所有资源（JS/CSS）
    // 需要有结构的HTML文件可以加一个template
    new HtmlWebpackPlugin({
      // 复制这个./src/index.html文件，并自动引入打包输出的所有资源（JS/CSS）
      template: './src/index.html',
    }),
  ],
  // 模式
  mode: 'development', // 开发模式
  // 开发服务器 devServer：用来自动化，不用每次修改后都重新输入webpack打包一遍（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：只会在内存中编译打包，不会有任何输出（不会像之前那样在外面看到打包输出的build包，而是在内存中，关闭后会自动删除）
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },
}
```

其中，大部分配置都在注释中给出解释。

- 运行项目的两个指令：
  webpack 会将打包结果输出出去（build文件夹）
  npx webpack-dev-server 只会在内存中编译打包，没有输出

- loader 和 plugin 的不同：（plugin 一定要先引入才能使用）

   loader：1. 下载 2. 使用（配置 loader）

   plugins：1.下载 2. 引入 3. 使用

##### 2.基本的生产环境下的webpack.config.js配置

```js
const { resolve } = require('path')
const MiniCssExtractorPlugin = require('mini-css-extract-plugin')
const OptimiziCssAssetsWebpackPlugin = require('optimizi-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 定义node.js的环境变量，决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production'

// 复用loader的写法
const commonCssLoader = [
  // 这个loader取代style-loader。作用：提取js中的css成单独文件然后通过link加载
  MiniCssExtractPlugin.loader,
  // css-loader：将css文件整合到js文件中
  // 经过css-loader处理后，样式文件是在js文件中的
  // 问题：1.js文件体积会很大2.需要先加载js再动态创建style标签，样式渲染速度就慢，会出现闪屏现象
  // 解决：用MiniCssExtractPlugin.loader替代style-loader
  'css-loader',
  /*
    postcss-loader：css兼容性处理：postcss --> 需要安装：postcss-loader postcss-preset-env
    postcss需要通过package.json中browserslist里面的配置加载指定的css兼容性样式
    在package.json中定义browserslist：
    "browserslist": {
      // 开发环境 --> 设置node环境变量：process.env.NODE_ENV = development
      "development": [ // 只需要可以运行即可
        "last 1 chrome version",
        "last 1 firefox version",
        "last 1 safari version"
      ],
      // 生产环境。默认是生产环境
      "production": [ // 需要满足绝大多数浏览器的兼容
        ">0.2%",
        "not dead",
        "not op_mini all"
      ]
    },
  */
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss', // 基本写法
      plugins: () => [
        // postcss的插件
        require('postcss-preset-env')(),
      ],
    },
  },
]

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader'],
      },
      /*
        正常来讲，一个文件只能被一个loader处理
        当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序
        先执行eslint再执行babel（用enforce）
      */
      {
        /*
          js的语法检查： 需要下载 eslint-loader eslint
          注意：只检查自己写的源代码，第三方的库是不用检查的
          airbnb(一个流行的js风格) --> 需要下载 eslint-config-airbnb-base eslint-plugin-import
          设置检查规则：
            package.json中eslintConfig中设置
              "eslintConfig": {
                "extends": "airbnb-base"， // 继承airbnb的风格规范
                "env": {
                  "browser": true // 可以使用浏览器中的全局变量(使用window不会报错)
                }
              }
        */
        test: /\.js$/,
        exclude: /node_modules/, // 忽略node_modules
        enforce: 'pre', // 优先执行
        loader: 'eslint-loader',
        options: {
          // 自动修复
          fix: true,
        },
      },
      /*
        js兼容性处理：需要下载 babel-loader @babel/core
          1. 基本js兼容性处理 --> @babel/preset-env
            问题：只能转换基本语法，如promise高级语法不能转换
          2. 全部js兼容性处理 --> @babel/polyfill
            问题：只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了
          3. 需要做兼容性处理的就做：按需加载  --> core-js
      */
      {
        // 第三种方式：按需加载
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎样的兼容性处理
          presets: [
            '@babel/preset-env', // 基本预设
            {
              useBuiltIns: 'usage', //按需加载
              corejs: { version: 3 }, // 指定core-js版本
              targets: { // 指定兼容到什么版本的浏览器
                chrome: '60',
                firefox: '50',
                ie: '9',
                safari: '10',
                edge: '17'
              },
            },
          ],
        },
      },
      {
        // 图片处理
        test: /\.(jpg|png|gif)/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'imgs',
          esModule: false, // 关闭url-loader默认使用的es6模块化解析
        },
      },
      // html中的图片处理
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      // 处理其他文件
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          outputPath: 'media',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 对输出的css文件进行重命名
      filename: 'css/built.css',
    }),
    // 压缩css
    new OptimiziCssAssetsWebpackPlugin(),
    // HtmlWebpackPlugin：html文件的打包和压缩处理
    // 通过这个插件会自动将单独打包的样式文件通过link标签引入
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
  ],
  // 生产环境下会自动压缩js代码
  mode: 'production',
}
```

#### 六、webpack有关配置参数

##### 1.entry参数

- entry入口起点,entry所配置的文件路径所指向的文件为项目的入口文件也就是内部依赖的开始会根据入口文件去逐层加载依赖。
- Chunk 和打包时入口文件配置有关如果 entry 是一个 string 或 array ，就只会生成一个 Chunk，这时 Chunk 的名称是 main
- 如果 entry 是一个 object ，就可能会出现多个 Chunk，这时 Chunk 的名称是 object 键值对里键的名称。

| 参数类型 | 说明                                                      | 示例                                   |
| -------- | --------------------------------------------------------- | -------------------------------------- |
| string   | 字符串类型，单入口写法，只会生成一个chunk                 | entry: './js/index.js'                 |
| Array    | 数组类型，但入口写法，多个文件一起编译，然后生成一个chunk | entry:['./app/entry1', './app/entry2'] |
| Object   | 对象类型，能够配置多个入口，并且每个入口生成一个chunk     | {a:'./a.js',b:'./b.js'}                |

传入字符串类型：

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: './src/main.js',
  output: {
    // 指定输出js文件名
    fileName: 'main.js'
    // 4.输出 main.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

传入数组类型:

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件
  entry: ['./src/main.js', './src/myjQuery.js'],
  output: {
    // 指定输出js文件名
    fileName: 'main.js'
    // 4.输出 main.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

传入Object，分两种情况

- 传入简单对象

```js
// 1.从 node环境 中导入 path 模块
const path = require('path');

// 2.声明导出一个 对象
module.exports = {
  // 3.JavaScript 执行入口文件是一个对象( 全写 )
  entry: {
    main:'./src/main.js'
  },
  output: {
    // 5.输出 bundle.js 文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
  }
};
```

上面entry中声明的代码等同于下面这个

```js
entry:'./src/main.js'
```

由此可以看出，只有一个键值对对应关系时，可以简略写法，并且文件名来源于指定的属性名

- 标准语法和多页面内容

```JS
const path = require('path');

module.exports = {
  // app  是指定入口代码块的名称（打包输出的文件默认以这个命名）
  // './src/main.js'  是加载的入口文件   
  entry: {
    app:'./src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  }
};
```

```JS
const path = require('path');

module.exports = {
  // home  是指定第一个入口代码块的名称（打包输出的文件默认以这个命名）
  // about 是指定第二个入口代码块的名称（打包输出的文件默认以这个命名）
  entry: {
    home:'./src/main.js',
    about:'./src/myjQuery.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  }
};

```

使用webpack命令打包后查看编译输出文件夹，发现输出了两个js

##### 2.output参数

output参数是个对象，**output** 属性告诉 webpack 在哪里输出它所创建的 *bundle*，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中。

下表列出最常见的参数

- 有关更多详细的参数请问官网：https://webpack.docschina.org/configuration/output/

| 参数名     | 参数说明                   |
| ---------- | -------------------------- |
| path       | 编译输出文件的目录路径     |
| fileName   | 输出的主文件名             |
| publicPath | 用来指定编译后资源公共路径 |

示例：

此配置将一个单独的 `bundle.js` 文件输出到 `dist` 目录中

```js
output: {
     path: './dist',
     filename: 'bundle.js'
}
```

当我们在entry中定义构建多个文件时，filename可以对应的更改为[name].js用于定义不同文件构建后的名字

```js
module.exports = {
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
};

// 写入到硬盘：./dist/app.js, ./dist/search.js
```

##### 3.module参数

开发中最常见的就是各种loader的使用，定义在module.rules中

**有关loader的说明：**loader 用于对模块的源代码进行转换。loader 可以使你在 `import` 或 "load(加载)" 模块时预处理文件。因此，loader 类似于其他构建工具中“任务(task)”，并提供了处理前端构建步骤的得力方式。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript 或将内联图像转换为 data URL。loader 甚至允许你直接在 JavaScript 模块中 `import` CSS文件

示例：

```js
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: 'css-loader' },
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
```


rules规则中Object config配置对象常见参数如下

| 参数名  | 参数说明                                                     |
| ------- | ------------------------------------------------------------ |
| test    | 表示对哪些文件进行处理，正则表达式匹配文件后缀名             |
| include | 表示处理资源包含的目录                                       |
| exclude | 表示处理资源排除的目录                                       |
| use     | 加载多个loader时需要声明的属性，数组类型，接受多个Loader或者配置对象 |
| enforce | 指定loader的执行顺序                                         |
| loader  | 加载单个loader时需要声明的属性                               |
| options | loader配置选项参数                                           |

**loader的执行顺序**

- 一般情况下，loader的执行顺序为（rules规则数组）从右往左，从下往上。

- enforce属性可以执行loader的执行顺序

| 参数类型 | 说明          |
| -------- | ------------- |
| pre      | 前置 权重最高 |
| normal   | 不变 权重第二 |
| inline   | 行内 权重第三 |
| post     | 后置 权重第四 |

其中配置对象中use属性可以包含不同参数类型

| 参数类型               | 参数说明                                   | 示例                                     |
| ---------------------- | ------------------------------------------ | ---------------------------------------- |
| string                 | 字符串类型，声明要使用Loader的名字         | use:['css-loader']                       |
| Object(instances)      | 可以通过实例对象加载loader                 | use:[MiniCssExtractPlugin.loader]        |
| Object(options config) | 通过对象配置参数形式获得对loader的详细配置 | use:[{loader:'css-loader',options: ...}] |

示例代码：

```js
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
}
```

**parse和noParse参数：**

`noParse` 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

`noParse` 是可选配置项，类型需要是 `RegExp`、`[RegExp]`、`function` 其中一个。

```js
// 使用正则表达式
noParse: /jquery|chartjs/

// 使用函数，从 Webpack 3.0.0 开始支持
noParse: (content)=> {
  // content 代表一个模块的文件路径
  // 返回 true or false
  return /jquery|chartjs/.test(content);
}
```

因为 Webpack 是以模块化的 JavaScript 文件为入口，所以内置了对模块化 JavaScript 的解析功能，支持 AMD、CommonJS、SystemJS、ES6。 `parser` 属性可以更细粒度的配置哪些模块语法要解析哪些不解析，和 `noParse` 配置项的区别在于 `parser` 可以精确到语法层面， 而 noParse 只能控制哪些文件不被解析。 `parser` 使用如下：

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: ['babel-loader'],
      parser: {
      amd: false, // 禁用 AMD
      commonjs: false, // 禁用 CommonJS
      system: false, // 禁用 SystemJS
      harmony: false, // 禁用 ES6 import/export
      requireInclude: false, // 禁用 require.include
      requireEnsure: false, // 禁用 require.ensure
      requireContext: false, // 禁用 require.context
      browserify: false, // 禁用 browserify
      requireJs: false, // 禁用 requirejs
      }
    },
  ]
}
```

**有关Module更多的参数配置，请参考官方文档：**https://webpack.docschina.org/configuration/module/

##### 4.plugin参数

这个参数用于配置各种插件。插件是 webpack 的 支柱功能。webpack 自身也是构建于你在 webpack 配置中用到的__相同的插件系统__之上

插件目的在于解决 [loader](https://webpack.docschina.org/concepts/loaders) 无法实现的__其他事__。

由于__插件__可以携带参数/选项，你必须在 webpack 配置中，向 `plugins` 属性传入一个 `new` 实例

示例：

```js
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
```

##### 5.resolve参数

用来配置如何去解析模块

示例：

```js
// 解析模块的规则
resolve: {
  // 配置解析模块路径别名: 优点：当目录层级很复杂时，简写路径；缺点：路径不会提示
  alias: {
    // 这样配置后，引入文件就可以这样简写：import '$css/index';
    $css: resolve(__dirname, 'src/css')
  },
  // 配置省略文件路径的后缀名（引入时就可以不写文件后缀名了）
  extensions: ['.js', '.json', '.jsx', '.css'],
  // 告诉 webpack 解析模块应该去找哪个目录
  modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
}
```

有关更多参数及用法请访问：https://webpack.docschina.org/configuration/resolve/

##### 6.devServer

webpack-dev-server是一个小型的node.js Express服务器,它使用webpack-dev-middleware中间件来为通过webpack打包生成的资源文件提供Web服务。简单来说，webpack-dev-server就是一个小型的静态文件服务器。使用它，可以为webpack打包生成的资源文件提供Web服务。

**有关devServer的配置选项及说明:**

```js
devServer: {
  // 运行代码所在的目录
  contentBase: resolve(__dirname, 'build'),
  // 监视contentBase目录下的所有文件，一旦文件变化就会reload
  watchContentBase: true,
  watchOptions: {
    // 忽略文件
    ignored: /node_modules/
  },
  // 启动gzip压缩
  compress: true,
  // 端口号
  port: 5000,
  // 域名
  host: 'localhost',
  // 自动打开浏览器
  open: true,
  // 开启HMR功能
  hot: true,
  // 不要显示启动服务器日志信息
  clientLogLevel: 'none',
  // 除了一些基本信息外，其他内容都不要显示
  quiet: true,
  // 如果出错了，不要全屏提示
  overlay: false,
  // 服务器代理，--> 解决开发环境跨域问题
  proxy: {
    // 一旦devServer(5000)服务器接收到/api/xxx的请求，就会把请求转发到另外一个服务器3000
    '/api': {
      target: 'http://localhost:3000',
      // 发送请求时，请求路径重写：将/api/xxx --> /xxx （去掉/api）
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}
```

其中，跨域问题：同源策略中不同的协议、端口号、域名就会产生跨域。

正常的浏览器和服务器之间有跨域，但是服务器之间没有跨域。代码通过代理服务器运行，所以浏览器和代理服务器之间没有跨域，浏览器把请求发送到代理服务器上，代理服务器替你转发到另外一个服务器上，服务器之间没有跨域，所以请求成功。代理服务器再把接收到的响应响应给浏览器。这样就解决开发环境下的跨域问题。

