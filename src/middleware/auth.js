module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthenticated");
    next();
};