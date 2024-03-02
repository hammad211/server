function validate(req, res, next) {
    if (req.user.roles != "teacher")
      return res.status(403).send("You are not authorized");
    next();
  }

  module.exports = validate;