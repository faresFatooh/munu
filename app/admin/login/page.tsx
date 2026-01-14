"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, Mail, Sparkles } from "lucide-react"
import Image from "next/image"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { user, loading, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      router.push("/admin")
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
    }

    setIsLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mehran-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-mehran-gold animate-spin mx-auto mb-4" />
          <p className="text-mehran-warm">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-mehran-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-mehran-gold animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-mehran-dark flex items-center justify-center p-4 relative overflow-hidden"
      dir="rtl"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-72 h-72 bg-mehran-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-mehran-gold/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md bg-mehran-dark-light/90 backdrop-blur-xl border-mehran-gold/20 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-mehran-gold/20 rounded-full blur-xl animate-pulse" />
            <Image
              src="/images/305574365-476836291159139-6829281272340201855-n.png"
              alt="Mehran Logo"
              fill
              className="object-contain relative z-10"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gradient-gold flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-mehran-gold" />
            لوحة التحكم
          </CardTitle>
          <CardDescription className="text-mehran-warm text-base mt-2">
            مرحباً بك في لوحة إدارة مطعم مهران
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 font-medium">
                البريد الإلكتروني
              </Label>
              <div className="relative group">
                <Mail
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mehran-warm group-focus-within:text-mehran-gold transition-colors"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mehran.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 bg-mehran-dark border-mehran-gold/20 text-white placeholder:text-gray-500 h-12 focus:border-mehran-gold focus:ring-mehran-gold/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300 font-medium">
                كلمة المرور
              </Label>
              <div className="relative group">
                <Lock
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mehran-warm group-focus-within:text-mehran-gold transition-colors"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-mehran-dark border-mehran-gold/20 text-white placeholder:text-gray-500 h-12 focus:border-mehran-gold focus:ring-mehran-gold/20"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-mehran-gold to-mehran-gold-light text-mehran-dark hover:from-mehran-gold-light hover:to-mehran-gold font-bold h-12 text-lg shadow-lg shadow-mehran-gold/20 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
