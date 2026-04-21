const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  animeId: { type: String, required: true },
  totalViews: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  dislikeCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PageView', pageViewSchema);
