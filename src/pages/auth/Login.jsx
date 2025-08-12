import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoginMutation } from "../../features/auth/authSlide";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { useLoginWithGoogle } from "../../components/social-auth/GoogleAuthComponent";
import { useLoginWithGithub } from "../../components/social-auth/GithubAuthComponent";

export default function Login() {
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();

  console.log(isLoading);

  const shcema = z.object({
    email: z.string().nonempty("email is required").email(),
    password: z.string().nonempty("password is required"),
  });

  const { loginWithGoogle, googleLogout } = useLoginWithGoogle();
  const { loginWithGithub, GithubLogout } = useLoginWithGithub();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(shcema),
  });

  const onSubmit = async (data) => {
    try {
      let result = await login(data).unwrap();

      if (result != undefined) {
        navigate("/");
      }
    } catch (errors) {
      toast.error(errors?.data?.message);
      console.log("ERROR: ", errors?.data?.message);
    } finally {
      reset();
    }
  };

  return (
    <section className="bg-teal-600 w-[100%] h-screen">
      <div className="h-screen flex justify-center flex-col items-center mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-sm md:min-w-xl bg-gray-50 p-5 rounded-2xl "
        >
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl text-center py-2 font-bold text-teal-600">
              Login
            </h1>
            <div className="flex flex-col">
              <input
                {...register("email")}
                className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
                placeholder="email"
                type="text"
              />
              {errors.email && (
                <span className="text-red-600 mt-2">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col relative">
              <div
                onClick={() => setIsShowPassword(!isShowPassword)}
                className="absolute top-4 right-4"
              >
                {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
                {/* <PiEye /> */}
              </div>
              <input
                {...register("password")}
                className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
              />
              {errors.password && (
                <span className="text-red-600 mt-2">
                  {errors.password.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 px-5 py-2 rounded-xl text-white"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        <div className="bg-teal-100 w-100 rounded-2xl mt-2 p-4">
          <p className="text-center text-gray-500">Test Login </p>
          <div className="flex gap-5 justify-center mt-5">
            <button
              onClick={loginWithGoogle}
              className="text-teal-500 text-3xl cursor-pointer"
            >
              <FaGoogle />
            </button>
            <button
              onClick={loginWithGithub}
              className="text-teal-500 text-3xl cursor-pointer"
            >
              <FaGithub />
            </button>
          </div>
          <p className="text-center text-gray-500">Test Logout</p>
          <div className="flex gap-5 justify-center mt-5">
            <button
              onClick={GithubLogout}
              className="text-teal-500 text-3xl cursor-pointer"
            >
              <FaGoogle />
            </button>
            <button
              onClick={googleLogout}
              className="text-teal-500 text-3xl cursor-pointer"
            >
              <FaGithub />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
