var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const crypto = require('crypto');
var _ = require('underscore');

const cipher = crypto.createCipher('aes192','34dc8f8612724b6e43c9414cc3309fd1809c84b1b9f73d0754d9788793ddb91d');

sequelize = new Sequelize('BloodDonors', 'root', 'vahidataj', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});


//database models
var User = require('../user-model.js')(sequelize,Sequelize);

// force: true will drop the table if it already exists
User.sync({force: false}).then(() => {});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create',function(req,res){
	cipher.update(req.body.password,'utf8','hex');
	User.create({
	    name: req.body.name,
	    phone: req.body.phone,
	    email:req.body.email,
	    password:cipher.final('hex')
    });
	res.status(200);
    res.send({success:true,message:'user successfully created.'});
});


router.post('/login',function(req,res){
	cipher.update(req.body.password,'utf8','hex');
	User.findOne({
		where:{
			name:req.body.name,
			password:cipher.final('hex')
		}
	}).then(user => {
  		if(user != null){
  			res.status(200);
  			res.send(_.omit(user.dataValues,'password'));
  		}else{
  			res.status(401);
  			res.send({success:false,message:'user not found'});
  		}
	});
})


module.exports = router;
