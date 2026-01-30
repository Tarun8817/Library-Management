import cron from "node-cron";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";

export const notifyUsers = () => {
  // Schedule the task to run every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    try {
      // Calculate the date/time 1 day ago from now
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Find borrowed books that are overdue and not yet notified
      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo }, // due date is older than 1 day
        returnDate: null,            // book has not been returned
        notified: false,             // user has not been notified yet
      });

      // Loop through all borrowers to send email reminders
      for (const element of borrowers) {
        try {
          // Populate user data if not already populated
          const borrowRecord = await Borrow.findById(element._id).populate('user');
          
          if (borrowRecord.user && borrowRecord.user.email) {
            // Send reminder email with correct parameter format
            await sendEmail(
              borrowRecord.user.email, 
              "Book Return Reminder",
              `<p>Hello ${borrowRecord.user.name},</p><p>This is a reminder that the book you borrowed is overdue for return. Please return it as soon as possible to avoid additional fines.</p><p>Thank you!</p>`
            );

            // Mark this borrow record as notified
            borrowRecord.notified = true;
            await borrowRecord.save();
            
            console.log(`Notification sent to ${borrowRecord.user.email}`);
          }
        } catch (emailError) {
          console.error(`Failed to send notification for borrow ID ${element._id}:`, emailError.message);
        }
      }
    } catch (error) {
      // Log any errors that occur during the cron execution
      console.error("Error in notifyUsers cron job:", error);
    }
  });
};
