const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: [4, 'too short, min is 4 characters'],
    max: [32, 'too long, max is 32 charachters'],
    required: 'Username is required'
  },
  email: {
    type: String,
    min: [4, 'too short, min is 4 characters'],
    max: [32, 'too long, max is 32 charachters'],
    unique: true,
    lowercase: true,
    required: 'Email is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    min: [4, 'too short, min is 4 characters'],
    max: [32, 'too long, max is 32 charachters'],
    required: 'Password is required'
  },
  rentals: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Rental'
    }
  ],
  bookings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Booking'
    }
  ]
});

userSchema.methods.isSamePassword = function(requestPassword) {

  return bcrypt.compareSync(requestPassword, this.password);
};

userSchema.pre('save', function(next){
  const user = this;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
})
});

module.exports = mongoose.model('User', userSchema);
