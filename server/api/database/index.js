'use strict';

var express = require('express');
var controller = require('./database.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/query', controller.query);
router.get('/spell', controller.spell);

module.exports = router;
