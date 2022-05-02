const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: false,
      match: [/.+@.+\..+/, 'Must match an email address!']
    },
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

const User = model('User', userSchema);

module.exports = User;
