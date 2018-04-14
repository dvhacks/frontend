const admin = require('firebase-admin');

try {
  admin.initializeApp();
} catch (e) { }

module.exports = {
  notifyUser: (userUid, payload) => {
    console.log(userUid, payload);

    return admin.database().ref(`/notification_tokens/${userUid}`).once('value').then(snapshot => {
      const registrationTokens = [];

      snapshot.forEach(token => {
        if (token.val()) {
          registrationTokens.push(token.key);
        }
      });

      if (registrationTokens.length) {
        return admin.messaging().sendToDevice(registrationTokens, payload)
          .then((response) => {
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
      } else {
        console.log('Not tokens registered');
      }
    });
  }

};
