"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import { toast } from "sonner";

function VerifyRequestContent() {
    const router = useRouter();
    const [otp, setOtp] = useState("");
    const [emailPending, startEmailTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get('email') as string
    const isOtpCompleted = otp.length === 6;

    function verifyOtp() {
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Email verified!")
                        router.push("/")
                    },
                    onError: () => {
                        toast.error("Error verifying email!")
                    }
                }
            })
        })
    }

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your email inbox</CardTitle>
                <CardDescription>
                    We have sent a verification OTP to your email address.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP maxLength={6} className="gap-2" value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3}/>
                            <InputOTPSlot index={4}/>
                            <InputOTPSlot index={5}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-sm text-muted-foreground">Enter or paste the 6-digit OTP sent to your email.</p>
                </div>

                <Button 
                    onClick={verifyOtp} 
                    disabled={emailPending || !isOtpCompleted} 
                    className="w-full"
                    >
                    {emailPending ? (
                        <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Verifying...</span>
                        </>
                    ) : (
                        "Verify Account"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}

function LoadingFallback() {
    return (
        <Card className="w-full mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your email inbox</CardTitle>
                <CardDescription>
                    Loading...
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <div className="h-12 w-64 bg-gray-200 rounded animate-pulse"></div>
                    <p className="text-sm text-muted-foreground">Loading verification form...</p>
                </div>
                <Button disabled className="w-full">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                </Button>
            </CardContent>
        </Card>
    )
}

export default function VerifyRequest() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <VerifyRequestContent />
        </Suspense>
    )
}