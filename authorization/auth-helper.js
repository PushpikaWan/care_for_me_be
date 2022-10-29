const admin = require("firebase-admin");
const {MONGODB_NAME} = require("../util/env-variables");

module.exports.authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
//todo - remove this later... by pass auth in local call to dev testing
  console.log('cameeee', MONGODB_NAME, req.headers.host)
  if (MONGODB_NAME === 'CARE_FOR_ME_DEV') {
    return next();
  }
  if (authHeader) {
    const idToken = authHeader.split(" ")[1];
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