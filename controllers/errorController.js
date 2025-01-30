const errorController = {};

// Simulate a server error
errorController.triggerError = (req, res, next) => {
  try {
    throw new Error("This is a simulated 500 error.");
  } catch (error) {
    next(error); // Pass the error to middleware
  }
};

module.exports = errorController;
