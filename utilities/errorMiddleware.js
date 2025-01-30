const errorMiddleware = (err, req, res, next) => {
    console.error("Server Error:", err.message);
    
    res.status(500).render("errors/500", {
      title: "500 - Server Error",
      message: err.message,
    });
  };
  
  module.exports = errorMiddleware;
  