var express = require('express');
var router = express.Router();
const axios = require('axios');
var Auth = require('../auth/auth');

/* GET home page. */
router.post('/', async function (req, res, next) {
    // Call Auth.checkAuthentication and pass req object
    const user = Auth.checkAuthentication(req);

    // Check if user is authenticated
    if (!user) {
        return res.status(401).send("Unauthorized");
    }

    axios.post(`http://localhost:3000/comentario/${req.body.tipo}/${req.body.post}`, {
        comentario: req.body.comentario,
        user: user.username,
        timestamp: new Date().toISOString().substring(0, 19)
    })
        .then(resp => {
            // Handle response
            res.status(200).send("Comment posted successfully");
        })
        .catch(erro => {
            // Handle error
            console.log(erro);
            res.status(500).send("Internal server error");
        });
});

module.exports = router;
