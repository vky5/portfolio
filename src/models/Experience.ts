import mongoose, { Schema, Document } from "mongoose";

export interface ExperienceLink {
  label: string;
  url: string;
}

export interface IExperience extends Document {
  role: string;
  company: string;
  logo?: string;
  period: string;
  sortDate?: Date;
  description: string;
  highlights: string[];
  skills: string[];
  // opensource: project contributions with no employer relationship — same
  // shape as work, plus `links` for the individual PRs.
  type: "work" | "achievement" | "opensource";
  links?: ExperienceLink[];
}

const ExperienceSchema: Schema = new Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String, default: "" },
  period: { type: String, default: "" },
  // Derived from `period`'s leading "Mon YYYY" at write time — `period` is
  // free text ("Jul 2025 - Sep 2025", "Present"), so it can't be sorted on
  // directly (Mongo would sort it alphabetically, not chronologically).
  sortDate: { type: Date },
  description: { type: String, default: "" },
  highlights: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  type: {
    type: String,
    enum: ["work", "achievement", "opensource"],
    required: true,
  },
  links: {
    type: [{ label: { type: String }, url: { type: String } }],
    default: [],
  },
});

export default mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);
