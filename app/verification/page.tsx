'use client'
import React, { useState } from 'react'
import OTPInput from 'react-otp-input'
import Cookies from 'js-cookie'
import { callApi } from '../lib/useCallApi';
import { useRouter } from 'next/navigation';

const page = () => {
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const handelSubmit = async() => {
        alert("OTP submitted: " + otp);
        if (otp.length != 6) {
            alert("Please enter a 6-digit OTP");
        } else {
            const res: any = await callApi({
                url: "auth/verify-otp",
                method: "post",
                data: {
                    user_id: JSON.parse(sessionStorage.getItem("verifySession") || "{}").id,
                    otp: otp,
                    purpose: JSON.parse(sessionStorage.getItem("verifySession") || "{}").purpose,
                }
            })
            console.log(res);
            if (res?.status === 200) {
                Cookies.set("access_token", res.data.access_token, { sameSite: "lax", expires: 1 / 144 });
                Cookies.set("refresh_token", res.data.refresh_token, { sameSite: "lax", expires: 60 });
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
                sessionStorage.removeItem("verifySession");
                alert("Phone number verified successfully! You can now access your dashboard.");
                router.replace("/home");
            } else {
                alert(res?.data?.message || res?.error || "OTP verification failed. Please try again.");
            }
        }
    }
    return (
        <>
            <div className="flex h-screen items-center justify-center bg-slate-100">
                <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                    <header className="mb-8">
                        <h1 className="text-2xl font-bold mb-1">Mobile Phone Verification</h1>
                        <p className="text-[15px] text-slate-500">Enter the 4-digit verification code that was sent to your phone number.</p>
                    </header>
                    <div>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            inputStyle={
                                "w-12 h-12 border-2 border-slate-300 rounded focus:outline-none focus:border-blue-500 mx-1 text-center text-lg"
                            }
                            numInputs={6}
                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props} />}
                        />
                        <div className="max-w-[260px] mx-auto mt-4">
                            <button onClick={handelSubmit} type="submit" className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150">
                                Verify Account
                            </button>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500 mt-4">Didn't receive code? <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Resend</a></div>
                </div>
            </div>
        </>
    )
}

export default page