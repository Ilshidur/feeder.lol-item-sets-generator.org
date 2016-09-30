import mongoose from 'mongoose';

var PatchVersionSchema = new mongoose.Schema({
  index: Number,
  id: Number,
  key: String,
  name: String,
  importPatch: String,
  importDate: Date
});

export default mongoose.model('PatchVersion', PatchVersionSchema);
