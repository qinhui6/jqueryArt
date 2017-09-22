const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var precss = require('precss');
var cssnext = require('cssnext');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path=require('path');
const cleanWebpackPlugin = require('clean-webpack-plugin');

//定义一些文件夹路径
const root_path=path.resolve(__dirname);
const src_path=path.resolve(root_path,'src');
const dist_path=path.resolve(root_path,'dist');
module.exports={
	devtool:'source-map',
	entry:src_path+'/main.js',
	output:{
		path:dist_path,//配置输出目录  生成的html里的引用路径用 publicPath
		filename:'js/[name].[hash:8].js',//以文件内容的MD5生成Hash名称的script来防止缓存
		sourceMapFilename:'[name].map',
		//publicPath:'/' //配置最终线上使用的路径，在 webpack plugin hook 中会输出这一路径
	},
	devServer:{
		contentBase:'tem',//本地服务器所加载的页面所在的目录
		port:'9999', //端口
		inline:true, //实时刷新
		historyApiFallback:false, //是否跳转到首页，单页开发时非常有用
		hot:true,
		watchContentBase: true
	},
	module:{
		rules:[{
			test:/(\.jsx|\.js)$/,
			use:{
				loader:"babel-loader"
			},
			exclude:/node_modules/
		},{
			test:/\.css$/,
			use:ExtractTextPlugin.extract({
				fallback:'style-loader',
				use:["css-loader","postcss-loader"]
			})
		},postcss: function() {
		  	return [autoprefixer, cssnext, precss, cssnano]
		},{
			test:/.(jpg|png)$/,
			use:{
				loader:"url-loader?limit=8192&name=images/[hash:8].[name].[ext]" //打包图片转成base64
			}
		}]
	},
	plugins:[
		new webpack.BannerPlugin('版权所有，翻版必究'),
		new HtmlWebpackPlugin({template:src_path+'/index.tpl'}),
		new webpack.HotModuleReplacementPlugin(),
		//new ExtractTextPlugin({filename:`[name].[contenthash].css`}), // 内联css提取到单独的styles的css
		// new webpack.optimize.UglifyJsPlugin({ //压缩代码
		// 	compress:{
		// 		warnings:false
		// 	},
		// 	except: ['$super', '$', 'exports', 'require'],    //排除关键字
		// 	sourceMap:true,//uglify压缩去掉了sourceMap;在使用sourceMap时，由于用到了uglify压缩插件，所以默认去除了js尾部的注释，导致无法找到map文件
		// }),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// new cleanWebpackPlugin(['dist'],{ //build的时候删除dist文件夹
		// 	root:__dirname,
		// 	dry:false,
		// 	verbose:true
		// }),
		new webpack.ProvidePlugin({
	        $:"jquery",
	        jQuery:"jquery",
	        "window.jQuery":"jquery"
	      })
	]
}