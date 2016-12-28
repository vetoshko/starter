'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const config = require(path.join(__dirname, 'config.json'));
const compileDir = path.join(__dirname, 'html');
const templateDir = path.join(__dirname, 'views');
const nunjucks = require('nunjucks');
const del = require('del');

nunjucks.configure('views', {
    autoescape: true,
});

let commonData = {};

if (config.commonData) {
	_.forEach(config.commonData, name => {
		let d = JSON.parse(fs.readFileSync(path.join(__dirname, `datasource/${name}.json`)));
		commonData[name] = d
	});
}

if (!fs.existsSync(compileDir)) {
	fs.mkdirSync(compileDir);
}

(() => {
	// clean folder
	del.sync([`${compileDir}/*.html`]);

	_.forEach(config.pages, page => {
		let template, 
			context, 
			res;

		template = fs.readFileSync(path.join(templateDir, `${page.name}.html`));

		context = {
			root: config.buildStatic,
		 	locals: {},
		 	common: commonData
		}

		if (page.pageData) {
		 	_.forEach(page.pageData,  (v, k) => {
		 		let d = JSON.parse(fs.readFileSync(path.join(__dirname, 'datasource', `${v}.json`)));
		 		context[v] = d
		 	});
		}

		if (page.pageVars) {
		 	_.forEach(page.pageVars, (v, k) => {
		 		context.locals[k] = v
		 	});
		}

		res = nunjucks.render(path.join(templateDir, `${page.name}.html`), context);
		fs.writeFileSync(path.join(compileDir, `${page.name}.html`), res);

	});
})()
