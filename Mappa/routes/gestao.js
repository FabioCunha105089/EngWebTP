var express = require('express');
var router = express.Router();
var axios = require('axios')
const Auth = require('../auth/auth')

/* GET home page. */
router.get('/', Auth.requireAuthentication, function(req, res, next) {
  res.render('gestao');
});

router.get('/utilizadores', Auth.requireAuthentication, function(req, res, next) {
    axios.get('http://localhost:3000/user')
      .then( resp => {
        console.log(resp.data);
        res.render('list_users', { users : resp.data});
      })
      .catch(error => {
        res.render('error', {error: error})
      })
  
});

module.exports = router;