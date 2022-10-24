const admin = require("firebase-admin");
const {CLIENT_EMAIL_ADDRESS, PRIVATE_KEY, PROJECT_ID} = require(
    "../util/env-variables");

admin.initializeApp({
      credential: admin.credential.cert(
          {
            "project_id": PROJECT_ID,
            "private_key": PRIVATE_KEY.replace(/\\n/g, '\n'),
            "client_email": CLIENT_EMAIL_ADDRESS,
          },
      )
    }
);

