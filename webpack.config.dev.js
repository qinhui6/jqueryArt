const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require("glob");
const path = require('path');
//定义一些文件夹路径
const root_path = path.resolve(__dirname);
const src_path = path.resolve(root_path, 'src');
const dist_path = path.resolve(root_path, 'dist');

//取得所有静态目录
let ProjectArray = glob.sync(src_path + "/*/index.js");
var ProjectEntries = {};
console.log(src_path + '/main.js');
var config = {
	devtool: 'eval-source-map',//cheap-module-eval-source-map
	//entry:src_path+'/index/index.js', //src_path+'/main.js',
	//entry:src_path+'/index/index.js',
	output: {
		path: dist_path,//__dirname+'/public',
		filename: "[name]-bundle-[hash].js",
		sourceMapFilename: '[name].map'
	},
	devServer: {
		host: '0.0.0.0',
		contentBase: 'tem',//本地服务器所加载的页面所在的目录
		port: '9999', //端口
		inline: true, //实时刷新
		historyApiFallback: false, //是否跳转到首页，单页开发时非常有用
		hot: true,
		watchContentBase: true
	},
	module: {
		rules: [{
			test: /(\.jsx|\.js)$/,
			use: {
				loader: "babel-loader"
			},
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ["css-loader", "postcss-loader"]
			})
		}, {
			test: /.(png|svg|jpg|gif)$/,
			use: {
				loader: "url-loader?limit=8192&name=images/[hash:8].[name].[ext]" //打包图片转成base64
			}
		}, {
			test: /.art$/,
			use: ['art-template-loader']
		},
		{
			test: /\.(html)$/,
			loader: "html-loader"
		}]
	},
	//plugins:plugins
	plugins: [
		//new webpack.BannerPlugin('版权所有，翻版必究'), //在文件头添加注释
		//new HtmlWebpackPlugin({template:src_path+'/index.art'}),
		new webpack.HotModuleReplacementPlugin(), //代码热更新，用于调试模式
		//new webpack.NamedModulesPlugin(),
		new ExtractTextPlugin({ filename: "[name].[contenthash].css" }), // 内联css提取到单独的styles的css
		// new webpack.optimize.UglifyJsPlugin({ //压缩代码压缩 js
		// 	compress:{
		// 		warnings:false
		// 	},
		// 	except: ['$super', '$', 'exports', 'require'],    //排除关键字
		// 	sourceMap:true,//uglify压缩去掉了sourceMap;在使用sourceMap时，由于用到了uglify压缩插件，所以默认去除了js尾部的注释，导致无法找到map文件
		// }),
		new webpack.optimize.OccurrenceOrderPlugin(), //调整模块的打包顺序，用到次数更多的会出现在文件的前面
		
	]
}
ProjectArray.forEach(function (f) {

	var regex = new RegExp(".*\/src\/(.*?)\/index\.js");
	var name = regex.exec(f)[1];
	console.log('name:', name);
	ProjectEntries[name] = f;
	console.log('f:', f);
	config.plugins.push(
		new HtmlWebpackPlugin({
			title: name, //设置生成的 html 文件的标题
			filename: name + '.html', //生成 html 文件的文件名。默认为 index.html.
			template: path.resolve(src_path,"assets/index.art"), //path.resolve(src_path+"/"+name,"assets/template.art"), //指定的模板文件
			inject: "body",//true默认值，script标签位于html文件的 body 底部;body同 true;head script 标签位于 head 标签内;false 不插入生成的 js 文件，只是单纯的生成一个 html 文件
			chunks: [name],
			//favicon: 'path/to/yourfile.ico'//生成的 html 标签中会包含一个 link 标签
		})
	);
});
config.entry = Object.assign({}, config.entry, ProjectEntries);
module.exports = config;
