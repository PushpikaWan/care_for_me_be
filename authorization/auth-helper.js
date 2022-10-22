const admin = require("firebase-admin");

module.exports.authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const idToken = authHeader.split(" ")[1];
    console.log('token', idToken);
    admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      console.log('uid check ----', decodedToken.uid);
      return next();
    })
    .catch(function (error) {
      console.log(error);
      return res.sendStatus(403);
    });
  } else {
    res.sendStatus(401);
  }
};