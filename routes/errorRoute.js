router.get('/500', (req, res, next) => {
    const error = new Error('Intentional Error!');
    error.status = 500;
    next(error);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

router.get("/", errorController.triggerError);

module.exports = router;
