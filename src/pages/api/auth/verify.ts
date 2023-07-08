import { z } from "zod";
import { prisma } from "~/server/db";
import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // validate incoming verification code - should be uuid
  const VerificationCode = z.object({
    code: z.string().uuid(),
  });

  console.log("test", VerificationCode.safeParse(req.body));
  const parsedCode2 = VerificationCode.safeParse(req.body);

  if (parsedCode2.success === false) {
    return res
      .status(200)
      .json({ type: "error", message: "The code is invalid" });
  }

  const parsedCode = VerificationCode.parse(req.body);

  // query DB and see if code exists, get user id
  const verificationData = await prisma.verification.findFirst({
    where: {
      token: parsedCode.code,
    },
  });

  if (!verificationData)
    return res
      .status(200)
      .json({ type: "error", message: "Verification code was not found." });

  // update user to indicate that email is verified
  const date = new Date();
  await prisma.user.update({
    where: {
      id: verificationData.userId,
    },
    data: {
      emailVerified: date,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: verificationData.userId,
    },
  });

  return res
    .status(200)
    .json({ type: "VerifyOk", message: "Verification successful" });
}
