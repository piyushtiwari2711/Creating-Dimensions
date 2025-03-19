const admin = require("firebase-admin");

const serviceAccount = require('../edtech-8cabc-firebase-adminsdk-fbsvc-8f26bf327b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:'https://edtech-8cabc-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

module.exports={admin}
