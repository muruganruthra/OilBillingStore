import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://muruganruthra125_db_user:pr1J466wS1XQw0jp@cluster0.v8aswcl.mongodb.net/?appName=Cluster0"
    )

    console.log("✅ MongoDB Atlas Connected")

  } catch (error) {
    console.error("❌ DB Error:", error)
    process.exit(1)
  }
}

export default connectDB