import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  year: string;
  description: string;
  tags: string[];
  githubLink: string;
  liveLink?: string;
  blogLink?: string;
  icon?: string;
  coverImage?: string;
  order: number;
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  githubLink: { type: String, default: "" },
  liveLink: { type: String, default: "" },
  blogLink: { type: String, default: "" },
  icon: { type: String, default: "" },
  coverImage: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
