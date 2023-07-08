import { NextPage } from "next";
import { signIn, getCsrfToken } from "next-auth/react";
import { FormEventHandler, useState } from "react";
import * as React from "react";

interface Props {}

const SignIn: NextPage = (props): JSX.Element => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // validate your userinfo
    e.preventDefault();

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    });

    console.log(res);
  };
  const [csrfToken, setCrsfToken] = React.useState(
    getCsrfToken()
      .catch((e) => console.error(e))
      .then((res) => setCrsfToken(res))
  );
  return (
    <div className="sign-in-form">
      <form
        action="/api/auth/callback/credentials"
        method="POST"
        className="flex w-full flex-col"
      >
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <h1>Login</h1>
        <input
          // value={userInfo.email}
          // onChange={({ target }) =>
          //   setUserInfo({ ...userInfo, email: target.value })
          // }
          id="email"
          type="email"
          name="email"
          placeholder="john@email.com"
        />
        <input
          id="password"
          type="password"
          name="password"
          // value={userInfo.password}
          // onChange={({ target }) =>
          //   setUserInfo({ ...userInfo, password: target.value })
          // }

          placeholder="********"
        />
        <button type="submit" value="Login">
          Login
        </button>
      </form>
    </div>
  );
};

export default SignIn;
