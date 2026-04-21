const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
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
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: '/avatars/default.png'
  },
  watchHistory: [{
    animeId: String,
    animeTitle: String,
    animeImage: String,
    episode: String,
    episodeNumber: Number,
    dubOrSub: { type: String, enum: ['sub', 'dub'], default: 'sub' },
    animeType: String,
    watchedAt: { type: Date, default: Date.now }
  }],
  watchlist: [{
    animeId: String,
    animeName: String,
    animeImage: String,
    animeType: String,
    addedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
