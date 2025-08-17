import cron from "node-cron";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Borrow } from "../models/borrowModel.js";

export const notifyUsers = () => {
  // Runs every 30 seconds
  cron.schedule("*/30 * * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo, 
        },
        returnDate: null,
        notified: false,
      });

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          const user = await User.findById(element.user.id);

          await sendEmail({
            email: element.user.email, 
            subject: "Book Return Reminder",
            message: `Hello ${element.user.name}, \n\nThis is a reminder that the book you borrowed is due for return today.`,
          });
          element.notified= true,
          await element.save();
        }
      }
    } catch (error) {
      console.error("Error in notifyUsers cron job:", error);
    }
  });
};
