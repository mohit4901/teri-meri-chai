import mongoose from "mongoose";
import MenuItem from "./models/menuItemModel.js";
import fs from "fs";

const MONGO_URI = "mongodb+srv://mohittt0011_db_user:mohit0011@cluster0.o1ncthk.mongodb.net/?retryWrites=true&w=majority";

async function seedMenu() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected!");

    const data = JSON.parse(fs.readFileSync("./menu.json"));

    await MenuItem.deleteMany({});
    console.log("Old menu cleared!");

    await MenuItem.insertMany(data);
    console.log("New menu inserted successfully!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedMenu();
