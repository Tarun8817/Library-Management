import cron from "node-cron";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";

export const notifyUsers = () => {
  // Schedule the task to run every 30 seconds
  cron.schedule("*/30 * * * * *", async () => {
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
        if (element.user && element.user.email) {
          const user = await User.findById(element.user.id);

          // Send reminder email
          await sendEmail({
            email: element.user.email, 
            subject: "Book Return Reminder",
            message: `Hello ${element.user.name}, \n\nThis is a reminder that the book you borrowed is due for return today.`,
          });

          // Mark this borrow record as notified
          element.notified = true;
          await element.save();
        }
      }
    } catch (error) {
      // Log any errors that occur during the cron execution
      console.error("Error in notifyUsers cron job:", error);
    }
  });
};
