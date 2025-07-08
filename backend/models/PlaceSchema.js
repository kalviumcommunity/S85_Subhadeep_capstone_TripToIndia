import mongoose from "mongoose";

const Doc = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  imageUrl: {
    type: String,
    required: true,
  },
});

const doc = mongoose.model("Doc", Doc);
export default doc;
