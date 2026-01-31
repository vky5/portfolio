import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project";
import Experience from "../models/Experience";
import Blog from "../models/Blog";
import Message from "../models/Message";

dotenv.config({ path: ".env" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

async function migrate() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    // Helper to read JSON
    const readJSON = async (file: string) => {
      try {
        const content = await fs.readFile(
          path.join(process.cwd(), file),
          "utf-8",
        );
        return JSON.parse(content);
      } catch (e) {
        console.error(`Error reading ${file}:`, e);
        return [];
      }
    };

    // Migrate Projects
    console.log("Migrating Projects...");
    const projects = await readJSON("src/data/projects.json");
    if (projects.length > 0) {
      await Project.deleteMany({});
      await Project.insertMany(
        projects.map((p: any) => {
          const { id, ...rest } = p;
          return rest; // Let MongoDB generate new IDs
        }),
      );
    }

    // Migrate Experience
    console.log("Migrating Experience...");
    const experience = await readJSON("src/data/experience.json");
    if (experience.length > 0) {
      await Experience.deleteMany({});
      await Experience.insertMany(
        experience.map((e: any) => {
          const { id, ...rest } = e;
          return rest;
        }),
      );
    }

    // Migrate Blogs (from content.json)
    console.log("Migrating Blogs...");
    const blogs = await readJSON("src/data/content.json");
    if (blogs.length > 0) {
      await Blog.deleteMany({});
      await Blog.insertMany(blogs); // Keep the slug id
    }

    // Migrate Messages
    console.log("Migrating Messages...");
    const messages = await readJSON("src/data/messages.json");
    if (messages.length > 0) {
      await Message.deleteMany({});
      await Message.insertMany(
        messages.map((m: any) => {
          const { id, date, ...rest } = m;
          return {
            ...rest,
            date: date ? new Date(date) : new Date(),
          };
        }),
      );
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
