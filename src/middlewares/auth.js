const adminAuth = (req, res, next) => {
  const token = "xyz";

  const isAuthorizedUser = "xyz" === token;
  if (!isAuthorizedUser) {
    res.status(401).send("Unauthorized Access.");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const userName = "Rahul";
  const isUserName = "Rahul" === userName;
  if (!isUserName) {
    res.status(401).send("Unauthorized Access.");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
