var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
const crypto = require('crypto');
var _ = require('underscore');

module.exports = function(sequelize,config){
	//database models
	var User = require('../user-model.js')(sequelize,Sequelize);	

	// force: true will drop the table if it already exists
	User.sync({force: false}).then(() => {});

	/* GET users listing. */
	router.get('/', function(req, res, next) {
		res.send('respond with a resource');
	});

	router.post('/create',function(req,res){
		cipher = crypto.createCipher('aes192',config.cryptoSecret);
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
		cipher = crypto.createCipher('aes192',config.cryptoSecret);
		cipher.update(req.body.password,'utf8','hex');
		console.log(req.body)
		User.findOne({
			where:{
				email:req.body.email,
				password:cipher.final('hex')
			}
		}).then(user => {
				if(user != null){
					res.status(200);
					res.send(_.omit(user.dataValues,'password'));
				}else{
					res.status(401);
					res.send({success:false,message:'Invalid email or password'});
				}
		});
	})
 return router;
};
