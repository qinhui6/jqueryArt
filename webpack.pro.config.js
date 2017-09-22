const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path=require('path');
const glob = require("glob");
const cleanWebpackPlugin = require('clean-webpack-plugin');
//定义一些文件夹路径
const root_path=path.resolve(__dirname);
const src_path=path.resolve(root_path,'src');
const dist_path=path.resolve(root_path,'dist');


var ProjectArray = glob.sync(src_path + "/*/index.js");
var ProjectEntries = {};

var config={
	devtool:'#inline-eval-source-map',
	output:{
		//path:dist_path,//配置输出目录  生成的html里的引用路径用 publicPath
		path: path.join(__dirname, "dist"),
		filename:'js/[name].[hash:8].js',//以文件内容的MD5生成Hash名称的script来防止缓存
		sourceMapFilename:'js/[name].[hash:8].map',
		publicPath:'' //配置最终线上使用的路径，在 webpack plugin hook 中会输出这一路径
	},
	module:{
		rules:[{
			test:/(\.jsx|\.js)$/,
			use:{
				loader:"babel-loader"
			},
			exclude:/node_modules/
		},{//url-loader:图片、字体图标加载器，是对file-loader的上层封装,支持base64编码。传入的size（也有的写limit) 参数是告诉它图片如果不大于 25KB 的话要自动在它从属的 css 文件中转成 BASE64 字符串。
			test:/\.css$/,
			use:ExtractTextPlugin.extract({	
				publicPath: '../',
				fallback:'style-loader',
				use:[
          {
            loader: 'css-loader',
            options:{
              minimize: true //css压缩
            }
          },"postcss-loader"
        ]
			})
		},{
			test:/.(jpg|png)$/,
			use:{
				loader:"url-loader?limit=8192&name=images/[hash:8].[name].[ext]" //打包图片小于8k转成base64，大于8k放到dist/images
			}
		},{
	        test: /.art$/,
	        use: [ 'art-template-loader' ]
	     }]
	},
	plugins:
	[
		new webpack.DefinePlugin({
		  'process.env': {
		    'NODE_ENV': '"production"'
		  }
		}),
		new webpack.optimize.DedupePlugin(),
		new ExtractTextPlugin({filename:`css/[name].[contenthash].css`}), // 内联css提取到单独的styles的css
		new webpack.optimize.UglifyJsPlugin({ //压缩代码
			output: {
		        comments: false,  // remove all comments
		      },
			compress:{
				join_vars: true,
				warnings:false
			},
			except: ['$super', '$', 'exports', 'require'],   //排除关键字
			sourceMap:true,//uglify压缩去掉了sourceMap;在使用sourceMap时，由于用到了uglify压缩插件，所以默认去除了js尾部的注释，导致无法找到map文件
		}),
		new cleanWebpackPlugin(['dist'],{ //build的时候删除dist文件夹
			root:__dirname,
			dry:false,
			verbose:true
		}),
		new webpack.optimize.CommonsChunkPlugin({
		    filename:"common.js",
				name:"commons",
				minChunks: Infinity
		})
	]
}
ProjectArray.forEach(function(f){
    var regex = new RegExp(".*\/src\/(.*?)\/index\.js");
    var name = regex.exec(f)[1];
    ProjectEntries[name] = f;
        config.plugins.push(
            new HtmlWebpackPlugin({
            title: name,
            filename: name + '.html',
            template: path.resolve(src_path,"assets/index.art"),//path.resolve(TEM_PATH,"./index.html"),
            inject: "body",
            chunks: [name,'commons'],
            minify: {
		        removeComments: true,
		        collapseWhitespace: true,
						removeAttributeQuotes: true,
		        removeEmptyAttributes: true,
		        minifyJS: true,
    				minifyCSS: true	    
		      },
        })
    );


});

config.entry = Object.assign({}, config.entry, ProjectEntries);
module.exports=config;