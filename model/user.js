var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    password: {type: String, required:true},
    salt:{type:String,required:true},
    email: {type: String,required:true},
    avatar:{type:String, default: '../images/marker.svg'},
    vail:{type:String},
    token:{type:String},
    role:{type:String, default:"guest"},
    u_created:{type: Date, default: Date.now},
    u_updated:{type: Date, default: Date.now},
    geo:{
        user_name: {type: String,required:true},
        location: {type: String,required:true},
    }
});
// Sets the created_at parameter equal to the current time
UserSchema.pre('save', function(next){
     var now = new Date();
    this.u_updated = now;
    if(!this.u_created) {
        this.u_created = now
    }
    next();
});
// UserSchema.index({geometry:"2dsphere"}) here untill changed to TTL index.
var User = mongoose.model('User', UserSchema);

module.exports= {User:User};