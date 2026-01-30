import { config } from "dotenv";
import { connectDB } from "./database/db.js";
import { User } from "./models/userModel.js";
import bcrypt from "bcrypt";

// Load environment variables
config({ path: "./config/config.env" });

// Connect to database
connectDB();

const createTestUser = async () => {
    try {
        // Check if test user already exists
        const existingUser = await User.findOne({ email: "admin@test.com" });
        
        if (existingUser) {
            console.log("✅ Test admin user already exists:");
            console.log("Email: admin@test.com");
            console.log("Password: admin123");
            console.log("Role:", existingUser.role);
            console.log("Account Verified:", existingUser.accountVerified);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Create test admin user
        const adminUser = await User.create({
            name: "Test Admin",
            email: "admin@test.com",
            password: hashedPassword,
            role: "Admin",
            accountVerified: true, // Skip OTP verification for test user
        });

        console.log("✅ Test admin user created successfully!");
        console.log("Email: admin@test.com");
        console.log("Password: admin123");
        console.log("Role: Admin");
        
        // Also create a test regular user
        const hashedUserPassword = await bcrypt.hash("user123", 10);
        
        const regularUser = await User.create({
            name: "Test User",
            email: "user@test.com", 
            password: hashedUserPassword,
            role: "User",
            accountVerified: true,
        });

        console.log("✅ Test regular user created successfully!");
        console.log("Email: user@test.com");
        console.log("Password: user123");
        console.log("Role: User");

    } catch (error) {
        console.error("❌ Error creating test users:", error.message);
    } finally {
        process.exit(0);
    }
};

createTestUser();