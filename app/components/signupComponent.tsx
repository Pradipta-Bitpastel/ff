"use client";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { callApi } from "../lib/useCallApi";
import { useRouter } from "next/navigation";

const SignupComponent = ({ onSwitchToLogin }: { onSwitchToLogin: () => void }) => {
    const router = useRouter();
    const signupSchema = z
        .object({
            fname: z
                .string()
                .min(2, "First name must be at least 2 characters"),

            lname: z
                .string()
                .min(2, "Last name must be at least 2 characters"),

            email: z
                .string()
                .email("Please enter a valid email address"),

            password: z
                .string()
                .min(8, "Password must be at least 8 characters")
                .regex(/[A-Z]/, "Must contain one uppercase letter")
                .regex(/[a-z]/, "Must contain one lowercase letter")
                .regex(/[0-9]/, "Must contain one number"),

            cpassword: z.string(),

        })
        .refine((data) => data.password === data.cpassword, {
            message: "Passwords do not match",
            path: ["cpassword"],
        });

    type SignupFormData = z.infer<typeof signupSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        console.log("Form Data:", data);
        const res:any = await callApi({
            url: "auth/signup",
            method: "post",
            data: {
                email: data?.email,
                signup_type: "system",
                password: data?.cpassword,
                first_name: data?.fname,
                last_name: data?.lname,
            }
        })

        if(res?.status === 200) {
            alert("Signup successful! Please enter your verification code.");
            sessionStorage.setItem("verifySession", JSON.stringify({ id: res?.data?.user?.id, purpose: "SIGNUP" }));
            sessionStorage.setItem("verifyEmail", data.email);
            router.replace("/verification");

        } else {
            alert(res?.data?.message || res?.error || "Signup failed. Please try again.");
        }
        console.log(res);
    };
    return (
        <>
            <main className="min-h-screen flex flex-col justify-center p-4 md:p-8">
                <div className="w-full max-w-lg mx-auto sm:max-w-4xl">
                    <div className="mb-12">
                        <a href="#">
                            <img
                                src="https://readymadeui.com/readymadeui.svg"
                                alt="logo"
                                className="w-40 inline-block"
                            />
                        </a>

                        <p className="text-slate-600 text-base mt-6">
                            Create your account and get started
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="John"
                                    {...register("fname")}
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 outline-slate-300"
                                />

                                {errors.fname && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.fname.message}
                                    </p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Doe"
                                    {...register("lname")}
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 outline-slate-300"
                                />

                                {errors.lname && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.lname.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register("email")}
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 outline-slate-300"
                                />

                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>


                            {/* Password */}
                            <div>
                                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 outline-slate-300"
                                />

                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="mb-2 text-slate-900 font-medium text-sm inline-block">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("cpassword")}
                                    className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 outline-slate-300"
                                />

                                {errors.cpassword && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.cpassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="py-2 px-3.5 text-sm rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Create an account
                            </button>
                        </div>

                        <div className="text-slate-900 text-sm mt-6">
                            Already have an account?
                            <span
                                onClick={onSwitchToLogin}
                                className="text-blue-700 hover:underline ml-1 font-medium cursor-pointer"
                            >
                                Login
                            </span>
                        </div>
                    </form>
                </div>
            </main>

        </>
    )
}

export default SignupComponent  