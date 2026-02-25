import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found in environment");
    process.exit(1);
}

const storedMemberSchema = new mongoose.Schema({
    membershipId: String,
    userId: String,
    username: String,
    name: String,
    adminUserId: String,
    planId: String,
    status: String,
    createdAt: Date,
}, { strict: false });

const StoredMember = mongoose.model("StoredMember", storedMemberSchema, "storedmembers");

async function run() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to MongoDB");

        const total = await StoredMember.countDocuments();
        console.log(`Total members in storedmembers: ${total}`);

        const sample = await StoredMember.find({}).limit(5).lean();
        console.log("Sample members:", JSON.stringify(sample, null, 2));

        const statuses = await StoredMember.distinct("status");
        console.log("Unique statuses:", statuses);

        const plans = await StoredMember.distinct("planId");
        console.log("Unique plan IDs:", plans);

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
