//import $ from 'jquery';
import template from './assets/template.art';
import '../assets/css/common.css';
import './assets/css/style.css';
import a from './assets/img/342.png'

$(function(){
	var data = {text:'hello world!!',a};
	$('#root').html(template(data));
});