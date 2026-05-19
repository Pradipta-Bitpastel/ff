'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from '@/app/store/counterSlice';
import SignupComponent from './signupComponent';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { callApi } from '../lib/useCallApi';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),

    remember: z.boolean().optional()
})

type LoginFormData = z.infer<typeof loginSchema>

const Formcomponent = () => {

    // const counterValue = useSelector((state: any) => state.counter.value);
    // const dispatch = useDispatch();
    const router = useRouter();
    const [view, setView] = useState<'login' | 'signup'>('login');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            remember: false
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        const res: any = await callApi({
            url: "auth/login",
            method: "post",
            data: {
                value: data?.email,
                password: data?.password,
                login_type: "system",
                identifier: "email"
            }
        })
        if (res?.status === 200) {
            alert("Login successful! Welcome back.");
            sessionStorage.setItem("verifySession", JSON.stringify({ id: res?.data?.user?.id, purpose: "TWO_FACTOR" }));
            router.replace("/verification");
        } else {
            alert(res?.data?.message || res?.error || "Login failed. Please check your credentials and try again.");
        }
        console.log(res);
    }


    if (view === 'signup') {
        return (
            <SignupComponent
                onSwitchToLogin={() => setView('login')}
            />
        )
    }

    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center">
                <div className="py-4 px-4 md:px-8">

                    <div className="grid items-center gap-6 max-w-6xl w-full lg:grid-cols-2">

                        <div className="border border-slate-300 rounded-lg p-6 max-w-md mx-auto shadow-sm md:p-8 lg:mx-0">

                            <div className="mb-8">
                                <h1 className="text-slate-900 text-3xl font-bold mb-4">
                                    Sign in
                                </h1>

                                <p className="text-slate-600 text-base leading-relaxed">
                                    Sign in to your account to access
                                    your dashboard and manage your projects.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                            >

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 text-slate-900 font-medium text-sm inline-block"
                                    >
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@readymadeui.com"
                                        {...register('email')}
                                        className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                                    />

                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 text-slate-900 font-medium text-sm inline-block"
                                    >
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
                                    />

                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Remember me */}
                                <div className="flex items-start flex-wrap gap-2">

                                    <label className="flex items-center group has-[input:checked]:text-slate-900">

                                        <input
                                            id="remember"
                                            type="checkbox"
                                            {...register('remember')}
                                            className="sr-only"
                                        />

                                        <span
                                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded outline-1 outline-slate-300 bg-white group-has-[input:checked]:bg-blue-600 group-has-[input:checked]:outline-blue-600 group-focus-within:outline-2 group-focus-within:outline-blue-600"
                                            aria-hidden="true"
                                        >
                                            <svg
                                                className="size-3 text-white opacity-0 group-has-[input:checked]:opacity-100"
                                                viewBox="0 0 12 10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path d="M1 5l3 3 7-7" />
                                            </svg>
                                        </span>

                                        <span className="ml-3 text-sm text-slate-700">
                                            Remember me
                                        </span>
                                    </label>

                                    <a
                                        href="#"
                                        className="ml-auto text-sm font-medium text-blue-700 hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-3.5 text-sm rounded-md font-semibold cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all"
                                >
                                    Sign in
                                </button>

                                <div className="text-slate-900 text-sm text-center">
                                    Don't have an account?

                                    <div
                                        onClick={() => setView('signup')}
                                        className="text-blue-700 hover:underline ml-1 font-medium cursor-pointer inline-block"
                                    >
                                        Sign up
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="aspect-[71/50] max-lg:w-4/5 mx-auto">
                            <img
                                src="https://readymadeui.com/images/integration-illus.webp"
                                className="w-full object-cover"
                                alt="login img"
                            />
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}

export default Formcomponent