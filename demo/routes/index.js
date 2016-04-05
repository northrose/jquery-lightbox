var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'jQuery Lightbox Demo' });
});

router.post('/lightbox/image', function( req, res ) {
    var src = req.body.src;
    if ( !src ) {
        res.render('validation-error', {
            layout: false,
            error_msg: "Image not provided." 
        } );
        return;
    }

    res.render('lightbox-image', {
        layout: false,
        src: src,
        alt: req.body.alt
    });
} );

module.exports = router;
