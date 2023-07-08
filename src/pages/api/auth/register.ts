import { z } from "zod";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "~/server/db";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyEmail } from "~/utils/verifyEmail";
import axios from "axios";

const Profile = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(2),
  passwordconfirm: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsedProfile = Profile.parse(req.body);
  console.log(req.body, parsedProfile);
  if (parsedProfile.password !== parsedProfile.passwordconfirm) {
    return res
      .status(400)
      .json({ type: "UserExists", message: "Passwords do not match" });
  }

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(parsedProfile.password, saltRounds);

  // check for existing user with submitted email
  const user = await prisma.user.findFirst({
    where: {
      email: parsedProfile.email,
    },
  });

  // stop processing if a user already exists and send error
  if (user) {
    return res
      .status(400)
      .json({ type: "UserExists", message: "User with that email exists." });
  }

  // we want to keep using the User/Account tables to keep things aligned
  // because of that we can create a random id for the ProviderId
  const randomNumber = uuidv4();

  // create user in User and Account tables
  const newUser = await prisma.user.create({
    data: {
      email: parsedProfile.email,
      name: parsedProfile.name,
      password: hashedPassword,
      accounts: {
        create: {
          type: "local",
          provider: "credentials",
          providerAccountId: randomNumber,
        },
      },
    },
  });

  // create verification token
  const verificationToken = uuidv4();
  await prisma.verification.create({
    data: {
      token: verificationToken,
      userId: newUser.id,
    },
  });

  res.status(200).json({
    message: "User created and verification email sent",
    name: parsedProfile.name,
    token: verificationToken,
    email: parsedProfile.email,
  });
}
