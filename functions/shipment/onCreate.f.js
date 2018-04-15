const functions = require('firebase-functions');
const admin = require('firebase-admin');

try {
  admin.initializeApp();
} catch (e) { }
const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const host = encodeURIComponent(functions.config().host.base_url);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports = module.exports = functions.database.ref('/shipments/{shipmentUid}').onCreate((shipment, context) => {
  const recipientEmail = shipment.recipient_email;
  const promises = [];

  if (recipientEmail) {
    const mailOptions = {
      from: `"Alexander Reichert" <${gmailEmail}>`,
      to: recipientEmail,
      subject: `Hi! Someone wants to ship a package to you!`,
      text: `if you would like to receive this package click go here ${host}/shipment/receive`
    };

    promises.push(mailTransport.sendMail(mailOptions));
  }

  return Promise.all(promises);
});
