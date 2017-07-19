const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/user_data', (req, res, next) => {
	
	
    if (req.user === undefined) {
                // The user is not logged in
                res.json({});
            } else {
                res.json({
                    username: req.user
                });
            }
});

module.exports = router;
