function validateStudent(req, res, next) {
    if (req.user.roles != "student")
      return res.status(403).send("You are not authorized");
    next();
  }

  module.exports = validateStudent;