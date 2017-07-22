import mongoose from 'mongoose';

const PatchVersionSchema = new mongoose.Schema({
  patchVersion: String,
  importDate: Date,
});

export default mongoose.model('PatchVersion', PatchVersionSchema);
