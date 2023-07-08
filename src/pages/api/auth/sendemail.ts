import type { NextApiRequest, NextApiResponse } from "next";
import { EmailTemplate } from "~/comp/email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body, "res");
  const verificationURL = `${process.env.NEXTAUTH_URL}/auth/verify/${req.body.token}`;

  try {
    const data = await resend.emails.send({
      from: "Tech <techsupport@elitefinpartners.com>",
      to: [req.body.email],
      subject: "Hello world",
      react: EmailTemplate({
        name: req.body.name,
        token: verificationURL,
      }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
