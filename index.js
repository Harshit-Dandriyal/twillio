const twilio = require("twilio");

const accountSid = "ACfebf0f7b0088475a516e0932dff31acd";
const authToken = "9e88311684f37fcd223dd04c58a38422";
const serviceSid = "VAf450fd33bb7c6e80fed9d6b6ec4dabff";
const client = twilio(accountSid, authToken);

exports.handler = async function (event, context) {
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
