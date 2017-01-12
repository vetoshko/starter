'use strict';

let fs = require('fs');
let path = require('path');
let express = require('express');
let router = express.Router();
let _ = require('lodash');
let config = require('../config.json');
let commonData = {};

/*router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express', ctx: global.siteDB });
});
*/

if (config.commonData) {
	_.forEach(config.commonData, name => {
		let d = JSON.parse(fs.readFileSync(path.join(__dirname, '../datasource', `${name}.json`)));
		commonData[name] = d
	});
}

_.forEach(config.pages, page => {

	router.get(page.route, (req, res, next) => {
		
		let context = {
			root: config.devStatic,
			locals: {},
			common: commonData,
			_env: process.env.NODE_ENV
		}

		if (page.pageData) {
			_.forEach(page.pageData,  (v, k) => {
				let d = JSON.parse(fs.readFileSync(path.join(__dirname, '../datasource', `${v}.json`)));
				context[v] = d
			});
		}

		if (page.pageVars) {
			_.forEach(page.pageVars, (v, k) => {
				context.locals[k] = v
			});
		}

		res.render(page.name, context)
	});

});

module.exports = router;
