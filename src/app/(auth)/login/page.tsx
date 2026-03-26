"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Store } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile, password })
        })

        if (res.ok) {
            router.push("/dashboard")
        } else {
            alert("Invalid mobile or password")
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Store className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Create Store Login</CardTitle>
                    <CardDescription>
                        Enter your mobile number to access your store
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Input
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button className="w-full" onClick={handleLogin}>
                        Sign in
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center text-sm">
                    <Link href="/register" className="underline">
                        Register
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}