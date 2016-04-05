var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'jQuery Lightbox Demo' });
});

router.post('/lightbox-image', function( req, res ) {
    res.send( "Got POST request." );
} );

module.exports = router;
