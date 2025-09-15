// ✅ Utility to catch errors in async route handlers
export const catchAsyncErrors = (theFunction) => {
    return (req, res, next) => {
        // Wrap the async function in a Promise
        Promise.resolve(theFunction(req, res, next))
            .catch((error) => {
                // Pass any error to Express error middleware
                next(error);
            });
    };
};
