const twilio = require("twilio");

const accountSid = "ACfebf0f7b0088475a516e0932dff31acd";
const authToken = "013dd3df510b9008ae8dcab5cdc90dd8";
const serviceSid = "VAf450fd33bb7c6e80fed9d6b6ec4dabff";
const client = twilio(accountSid, authToken);

exports.handler = async function (event, context) {
  // Define CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

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
        headers,
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
        headers,
        body: JSON.stringify({ success: response.valid }),
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: "Invalid action" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
