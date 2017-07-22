import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  index: Number,
  id: Number,
  name: String,
  importPatch: String,
  importDate: Date,
});

export default mongoose.model('Item', ItemSchema);
