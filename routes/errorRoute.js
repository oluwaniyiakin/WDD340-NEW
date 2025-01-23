router.get('/500', (req, res, next) => {
    const error = new Error('Intentional Error!');
    error.status = 500;
    next(error);
});

module.exports = router;
