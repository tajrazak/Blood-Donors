function userModel(sequelize,Sequelize){
	const User = sequelize.define('user', {
	  name: {
	    type: Sequelize.STRING
	  },
	  phone:{
	  	type:Sequelize.STRING
	  },
	  email:{
	  	type:Sequelize.STRING,
	  	unique:true
	  },
	  password:{
	  	type:Sequelize.STRING,
	  	unique:true
	  }
	});	

	return User
}


module.exports = userModel;