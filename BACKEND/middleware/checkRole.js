exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log("Allowed Roles", allowedRoles);
        console.log("User role", req.user?.role);
        if (allowedRoles.includes(req.user?.role)) {
            next();
        }
        else {
            return res.status(403).json({ message: "You don't have access to this API" })
        }
    }
}