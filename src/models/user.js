"use strict";

function UserModel(mongoose){
	var Schema = mongoose.Schema

	var UserSchema = new Schema({
		username : String,
		password : String,
		language : String,
		registrationDate : {type : Date, default : Date.now}
	});

	return mongoose.model('User', UserSchema);
}

module.exports = UserModel;