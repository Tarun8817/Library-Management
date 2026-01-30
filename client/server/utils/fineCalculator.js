// Function to calculate fine based on due date
export const calculatefine = (dueDate) => {
    const finePerHour = 0.1; // Fine rate per hour (10 cents)

    const today = new Date(); // Current date and time

    // Check if the current date is past the due date
    if (today > dueDate) {
        // Calculate the difference in hours between now and the due date
        const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60));
        // Calculate total fine
        const fine = lateHours * finePerHour;
        return fine;
    }

    // If book is returned on time or early, no fine
    return 0;
};
