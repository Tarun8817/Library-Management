import { config } from "dotenv";
import { connectDB } from "./database/db.js";
import { User } from "./models/userModel.js";
import bcrypt from "bcrypt";

// Load environment variables
config({ path: "./config/config.env" });

// Connect to database
connectDB();

const testLogin = async () => {
    try {
        console.log("🔍 Testing login functionality...\n");

        // Test admin login
        const adminEmail = "admin@test.com";
        const adminPassword = "admin123";

        console.log(`Testing admin login: ${adminEmail}`);
        
        const adminUser = await User.findOne({ 
            email: adminEmail, 
            accountVerified: true 
        }).select("+password");

        if (!adminUser) {
            console.log("❌ Admin user not found or not verified");
            return;
        }

        const isAdminPasswordMatch = await bcrypt.compare(adminPassword, adminUser.password);
        
        if (isAdminPasswordMatch) {
            console.log("✅ Admin login successful!");
            console.log(`   Name: ${adminUser.name}`);
            console.log(`   Role: ${adminUser.role}`);
            console.log(`   Verified: ${adminUser.accountVerified}`);
        } else {
            console.log("❌ Admin password incorrect");
        }

        console.log("\n" + "=".repeat(50) + "\n");

        // Test regular user login
        const userEmail = "user@test.com";
        const userPassword = "user123";

        console.log(`Testing user login: ${userEmail}`);
        
        const regularUser = await User.findOne({ 
            email: userEmail, 
            accountVerified: true 
        }).select("+password");

        if (!regularUser) {
            console.log("❌ Regular user not found or not verified");
            return;
        }

        const isUserPasswordMatch = await bcrypt.compare(userPassword, regularUser.password);
        
        if (isUserPasswordMatch) {
            console.log("✅ User login successful!");
            console.log(`   Name: ${regularUser.name}`);
            console.log(`   Role: ${regularUser.role}`);
            console.log(`   Verified: ${regularUser.accountVerified}`);
        } else {
            console.log("❌ User password incorrect");
        }

        console.log("\n🎯 Test completed! You can now login with these credentials:");
        console.log("   Admin: admin@test.com / admin123");
        console.log("   User:  user@test.com / user123");

    } catch (error) {
        console.error("❌ Error testing login:", error.message);
    } finally {
        process.exit(0);
    }
};

testLogin();