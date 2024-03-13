import mongoose from 'mongoose';

const DB = process.env.DATABASE;

if (!DB) {
  console.error("Environment variable DATABASE is not defined.");
  process.exit(1); // Exit the process if DATABASE is not defined
}

mongoose
  .connect(DB)
  .then(() => console.log("Database connected Successfully"))
  .catch((error) => console.error("Error:", error.message));