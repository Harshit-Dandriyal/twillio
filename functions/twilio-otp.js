const twilio = require("twilio");
const cors = require("cors");

const accountSid = "your-twilio-account-sid";
const authToken = "your-twilio-auth-token";
const serviceSid = "your-twilio-verify-service-sid";
const client = twilio(accountSid, authToken);

// Initialize cors middleware
const corsHandler = cors({ origin: "*" });

exports.handler = async function (event, context, callback) {
  // Apply CORS headers
  await new Promise((resolve, reject) => {
    corsHandler(event, context, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  const { action, phoneNumber, otp } = JSON.parse(event.body);

  try {
    if (action === "send") {
      const response = await client.verify
        .services(serviceSid)
        .verifications.create({
          to: phoneNumber,
          channel: "sms",
        });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, sid: response.sid }),
      };
    } else if (action === "verify") {
      const response = await client.verify
        .services(serviceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code: otp,
        });
      return {
        statusCode: 200,
        body: JSON.stringify({ success: response.valid }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Invalid action" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
