var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/payment', function(req, res) {
    session = req.session;
    res.sendFile(path.join(__dirname, '../', 'public/resources/components/views/payment.html'));
});

module.exports = router;
