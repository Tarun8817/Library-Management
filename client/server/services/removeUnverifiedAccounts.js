import cron from "node-cron";
import { User } from '../models/userModel.js';

export const removeUnverifiedAccounts = () => {
  // Schedule the task to run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      // Calculate the timestamp 30 minutes ago
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      // Delete all users who are not verified and were created more than 30 minutes ago
      const result = await User.deleteMany({
        accountVerified: false,          // Only unverified accounts
        createdAt: { $lt: thirtyMinutesAgo }, // Created more than 30 minutes ago
      });

      console.log(`Deleted ${result.deletedCount} unverified accounts`);
    } catch (error) {
      console.error("Error in removeUnverifiedAccounts cron job:", error);
    }
  });
};
