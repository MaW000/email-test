import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";

interface Props {
  type: string;
  message: string;
}

export default function Verify(props: Props) {
  if (props.type === "error") {
    return (
      <>
        <div className="mb-2 flex w-full justify-center"></div>
        <div className="mb-4 flex w-full flex-col items-center">
          <h1 className="text-error">Whoops</h1>
          <p className="mt-2 text-center">
            We've failed to verify your email. Please contact Terra at{" "}
            <a href="info@savemrterra.com">info@savemrterra.com</a> to resolve
            this issue.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <>
        <div className="mb-11 flex w-full justify-center"></div>
        <div
          className="mb-4 flex w-full flex-col items-center
            "
        >
          <h1 className="text-primary">Woo hoo!</h1>
          <p className="mt-2 text-center">
            Sucessfully created account. Welcome to Terra!
          </p>
          <Link href="/auth/login">Sign In</Link>
        </div>
      </>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { data } = await axios.post(
    `${process.env.NEXTAUTH_URL}/api/auth/verify`,
    {
      code: context.params?.code,
    }
  );

  return {
    props: data,
  };
}
