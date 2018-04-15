const functions = require('firebase-functions');
const admin = require('firebase-admin');

try {
  admin.initializeApp();
} catch (e) { }
const nodemailer = require('nodemailer');
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const host = functions.config().host.base_url;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports = module.exports = functions.database.ref('/shipments/{shipmentUid}').onCreate((shipment, context) => {
  console.log('shipment', shipment);
  console.log('context', context);

  const recipientEmail = shipment._data.recipient_email;
  const promises = [];

  if (recipientEmail) {
    const mailOptions = {
      from: `"Grasshoppr" <${gmailEmail}>`,
      to: recipientEmail,
      subject: `Hi! Someone wants to ship a package to you!`,
      text: `if you would like to receive this package click go here ${host}/confirm/${context.params.shipmentUid}`
    };

    promises.push(mailTransport.sendMail(mailOptions));
  }

  return Promise.all(promises);
});
