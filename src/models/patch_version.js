import mongoose from 'mongoose';

var PatchVersionSchema = new mongoose.Schema({
  patchVersion: String,
  importDate: Date
});

export default mongoose.model('PatchVersion', PatchVersionSchema);
