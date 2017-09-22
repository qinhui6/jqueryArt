//import $ from 'jquery';
import template from './assets/template.art'
import './assets/css/css.css'

$(function(){
	console.log(template);
	var data = {text:'2233222'};
	console.log(template(data));
	$('#root').html(template(data));
});