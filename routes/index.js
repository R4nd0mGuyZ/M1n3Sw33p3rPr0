var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'M1n3Sw33p3rPr0' });
});

module.exports = router;
