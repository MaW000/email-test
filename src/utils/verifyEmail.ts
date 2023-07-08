import Mailjet from "node-mailjet";

export const verifyEmail = (email: string, name: string, code: string) => {
  const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY,
  });

  const verificationURL = `${process.env.APP_URL}/auth/verify/${code}`;
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "techsupport@elitefinpartners.com",
          Name: "Terra",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: "Verify Your Email",
        TextPart:
          "Please use the following link to verify your email and finish creating your Terra account.",
        HTMLPart: `<h3>Verify Email</h3><p>Please use the following link to verify your email and finish creating your Terra account.</p><p><a href="${verificationURL}">${verificationURL}</a></p>`,
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};
