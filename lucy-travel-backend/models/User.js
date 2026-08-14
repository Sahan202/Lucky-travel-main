const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'users' });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  // Check if password is hashed
  if (this.password.startsWith('$2')) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
  // Plain text comparison (for existing data)
  return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
