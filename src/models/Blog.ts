import mongoose, { Schema, Document } from "mongoose";

interface IChapter {
  title: string;
  content: string;
}

export interface IBlog extends Document {
  id: string; // slug
  title: string;
  date: string;
  readTime: string;
  category: string;
  type: "external" | "native-simple" | "native-book";
  excerpt: string;
  coverImage?: string;
  image?: string; // keeping image for backward compatibility
  externalLink?: string;
  content?: string;
  bookData?: {
    chapters: IChapter[];
  };
}

const ChapterSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const BlogSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true }, // slug
  title: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  category: { type: String, required: true },
  type: {
    type: String,
    enum: ["external", "native-simple", "native-book"],
    required: true,
  },
  excerpt: { type: String, required: true },
  coverImage: { type: String },
  image: { type: String },
  externalLink: { type: String },
  content: { type: String },
  bookData: {
    chapters: [ChapterSchema],
  },
});

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);
