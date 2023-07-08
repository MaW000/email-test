import * as React from "react";
import { getProviders, signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, FieldValues } from "react-hook-form";

export default function Register() {
  const providers = getProviders();
  const [error, setError] = React.useState({
    status: false,
    message: "",
  });
  const [success, setSuccess] = React.useState({
    status: false,
    email: "",
  });

  const formSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(2),
    passwordconfirm: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) });

  const signinMutation = useMutation((data: FieldValues) => {
    return axios
      .post("/api/auth/register", data)
      .then((res) => {
        console.log(res.data.token, "a", res.data);
        axios.post("/api/auth/sendemail", {
          email: res.data.email,
          name: res.data.name,
          token: res.data.token,
        });
        setSuccess({ status: true, email: res.data.email });
      })

      .catch((err) => {
        setError({ status: true, message: err.response.data.message });
      });
  });
  interface FormSchema {
    email: string;
    name: string;
    password: string;
    passwordconfirm: string;
  }
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data, "a");
    signinMutation.mutate(data);
  };

  if (success.status === true) return <h1>sent</h1>;

  return (
    <>
      <div className="mt-3 flex flex-col items-center">
        <h1 className="mb-1 mt-6">Create Account</h1>
      </div>
      <h1 className="mb-9 text-center">
        Join your fellow Terrarians - it takes less than a minute!
      </h1>
      <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
        <label htmlFor="email">
          <h1 className="mb-2">Email</h1>
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          required={true}
          placeholder="e.g. janedoe@gmail.com"
          className="mb-5"
        />
        <label htmlFor="name">
          <h1 className="mb-2">Name</h1>
        </label>
        <input
          type="text"
          {...register("name")}
          id="name"
          required={true}
          placeholder="e.g. Jane Doe"
          className="mb-5"
        />
        <label htmlFor="password">
          <h1 className="mb-2">Password</h1>
        </label>
        <input
          type="password"
          id="password"
          {...register("password")}
          required={true}
          title="h3"
          placeholder="Enter your password"
          className="mb-2"
        />
        <input
          type="password"
          id="passwordconfirm"
          {...register("passwordconfirm")}
          required={true}
          placeholder="Confirm your password"
          className="mb-5"
        />

        <button type="submit">Create Account</button>
      </form>

      {error.status === true && <h1>{error.message}</h1>}
      {errors.email?.type === "invalid_string" && <h1>Email is required</h1>}
      {errors.name?.type === "too_small" && <h1>Name is required</h1>}
      {errors.password?.type === "too_small" && (
        <h1>A Password of 10 characters or more is required</h1>
      )}
      <div className="relative mb-4 flex w-full flex-row justify-center">
        <h1 className="terra-or relative mt-5 block w-full text-center">or</h1>
      </div>
      {Object.values(providers)
        .filter((provider) => provider.id !== "credentials")
        .map((provider) => {
          return (
            <div key={provider.id} className="mb-4 w-full">
              <button
                type="submit"
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "/dashboard",
                  })
                }
              >
                Continue with {provider.name}
              </button>
            </div>
          );
        })}
      <div className="mt-8 flex flex-row justify-center">
        <p>
          Have an account?{" "}
          <Link className="font-bold underline" href="/auth/login">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
