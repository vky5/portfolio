import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
  skills: string[];
  type: "work" | "achievement";
}

const ExperienceSchema: Schema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, default: "" },
  description: { type: String, default: "" },
  highlights: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  type: { type: String, enum: ["work", "achievement"], required: true },
});

export default mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);
