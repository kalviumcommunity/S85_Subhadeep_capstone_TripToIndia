import mongoose from "mongoose";

const Doc = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
});

const doc = mongoose.model("Doc", Doc);
export default doc;
