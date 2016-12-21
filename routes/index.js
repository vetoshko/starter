'use strict';

let express = require('express');
let router = express.Router();
let config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', ctx: global.siteDB });
});


module.exports = router;
