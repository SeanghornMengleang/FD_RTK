import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRegisterMutation } from "../../features/auth/authSlide";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { PiEye } from "react-icons/pi";
import {  useUploadFileMutation } from "../../file/fileSlice";

export default function Register() {
   const [uploadFile] = useUploadFileMutation();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const schema = z.object({
    name: z.string().nonempty("name is required"),
    email: z.string().nonempty("Email is required").email("Invalid email"),
    password: z.string().nonempty("Password is required").min(4, "password must be eqaul or greater than 4 letters"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: ""
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {

    const formdata = new FormData()
    formdata.append("file", image)

    try {
      const fileRes = await uploadFile(formdata).unwrap();
       console.log("upload image", fileRes);

      const submitData = {
        ... data,
        avatar: fileRes.location
      }
      console.log("submit data", submitData);

      await registerUser(submitData).unwrap();

    } catch (error) {
      
      console.log("error", error)
    } finally {
      watch();
    }
  };

  const handleImagePreview = (e) => {
    const file = e.target.files?.[0];
    if (!file) {

      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <section class="bg-teal-600 w-full h-screen">
      <div class="h-screen flex justify-center items-center mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          class="min-w-sm md:min-w-xl bg-gray-50 p-5 rounded-2xl"
        >
          <div class="flex flex-col gap-5">
            <h1 class="text-3xl text-center py-2 font-bold text-teal-600">
              Register
            </h1>

            {/* Image Upload */}
            <div class="flex items-center justify-center w-[200px] h-[200px] mx-auto">
              {preview ? (
                <div class="relative">
                  <img
                    src={preview}
                    alt="preview"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    type="file"
                    class="w-[200px] h-[200px] rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
              ) : (
                <label
                  for="dropzone-file"
                  class="w-full h-full flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold">Upload Profile</span>
                    </p>
                  </div>
                  <input
                  {...register("avatar")}
                    onChange={(e) => handleImagePreview(e)}
                    id="dropzone-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    class="hidden"
                  />
                </label>
              )}
            </div>

            {/* name */}
            <div class="flex flex-col">
              <input
                {...register("name")}
                class="w-full px-2.5 py-2.5 border border-slate-400 rounded-xl"
                placeholder="name"
                type="text"
              />
              {errors.name && (
                <span class="text-red-600 mt-2">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div class="flex flex-col">
              <input
                {...register("email")}
                class="w-full px-2.5 py-2.5 border border-slate-400 rounded-xl"
                placeholder="Email"
                type="text"
              />
              {errors.email && (
                <span class="text-red-600 mt-2">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div class="flex flex-col relative">
              <div
                onClick={() => setIsShowPassword(!isShowPassword)}
                class="absolute top-4 right-4 cursor-pointer"
              >
                {isShowPassword ? <PiEye /> : <FaRegEyeSlash />}
              </div>
              <input
                {...register("password")}
                class="w-full px-2.5 py-2.5 border border-slate-400 rounded-xl"
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
              />
              {errors.password && (
                <span class="text-red-600 mt-2">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              class="bg-teal-600 hover:bg-teal-700 px-5 py-2 rounded-xl text-white"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
