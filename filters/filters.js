'use strict'
let fs = require('fs');
let path = require('path');
let config = require('../config.json');

let filters = {
	export: false,
	loop: (arr, count) => {
		let result = [];
		let counter  = 0;

		function pushItem (idx) {
		  result.push(arr[counter]);

		  if (idx < count -1) {
		    counter = arr[counter+1] ? counter+1 : 0;
		    pushItem (++idx);
		  }
		}
		pushItem (0)
		return result
	},

	asset: path => {

		return filters.export ? config.dpe ? `@File(${path})` : `${config.buildStatic}${path}` : `${config.devStatic}${path}`
		//if () {}
		//return config.dpe ? `@File(${filters.dir}${path})` : `${filters.dir}${path}`
	},
	img_asset: path => {
		return filters.export ? config.dpe ? `@File(\'images/${path}\')` : `${config.buildStatic}images/${path}` : `${config.devStatic}images/${path}`

		//return config.dpe ? `@File('images/${path}')` : `${filters.dir}images/${path}`
	},
	js_asset: path => {
		return filters.export ? config.dpe ? `@File(\'js/${path}\')` : `${config.buildStatic}javascripts/${path}` : `${config.devStatic}javascripts/${path}`
		//return config.dpe ? `@File('js/${path}')` : `${filters.dir}javascripts/${path}`;
	},
	css_asset: path => {
		//return config.dpe ? `@File('css/${path}')` : `${filters.dir}stylesheets/${path}`;

		return filters.export ? config.dpe ? `@File(\'css/${path}\')` : `${config.buildStatic}stylesheets/${path}` : `${config.devStatic}stylesheets/${path}`
	}
}

module.exports = filters;