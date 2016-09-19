import mongoose from 'mongoose';

var SetSchema = new mongoose.Schema({
  title: String,
  champion: String,
  role: String,
  isCustom: Boolean,
  author: String,
  itemBlocks: [new mongoose.Schema({
    items: [new mongoose.Schema({
      count: Number,
      id: String
    })],
    type: String
  })]
});

var SetsSchema = new mongoose.Schema({
  generationDate: Date,
  patchVersion: String,
  sets: [SetSchema]
});

export default mongoose.model('ItemSet', SetsSchema);
