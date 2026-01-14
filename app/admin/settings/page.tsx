"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ref, onValue, update } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, Upload } from "lucide-react"
import type { SiteSettings } from "@/types/menu"
import { uploadImage } from "@/lib/cloudinary"

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingHero, setIsUploadingHero] = useState(false)

  const [settings, setSettings] = useState<SiteSettings>({
    logo: "",
    restaurantNameAr: "مطعم ومطبخ مهران",
    restaurantNameEn: "Mehran Kitchen & Restaurant",
    heroImage: "",
    serviceCharge: 10,
    currency: "₪",
    phone: "",
    address: "",
    workingHours: "",
  })

  useEffect(() => {
    const settingsRef = ref(database, "settings")
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }))
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploadingLogo(true)
      try {
        const imageUrl = await uploadImage(file)
        setSettings((prev) => ({ ...prev, logo: imageUrl }))
      } catch (error) {
        console.error("Error uploading logo:", error)
      }
      setIsUploadingLogo(false)
    }
  }

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploadingHero(true)
      try {
        const imageUrl = await uploadImage(file)
        setSettings((prev) => ({ ...prev, heroImage: imageUrl }))
      } catch (error) {
        console.error("Error uploading hero:", error)
      }
      setIsUploadingHero(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await update(ref(database, "settings"), settings)
      alert("تم حفظ الإعدادات بنجاح!")
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("حدث خطأ أثناء الحفظ")
    }
    setIsSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-mehran-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader user={user} title="الإعدادات" />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Branding */}
        <Card className="bg-mehran-dark-light border-mehran-gold/20">
          <CardHeader>
            <CardTitle className="text-white">العلامة التجارية</CardTitle>
            <CardDescription className="text-gray-400">إعدادات الشعار واسم المطعم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">اسم المطعم بالعربية</Label>
                <Input
                  value={settings.restaurantNameAr}
                  onChange={(e) => setSettings((prev) => ({ ...prev, restaurantNameAr: e.target.value }))}
                  className="bg-mehran-dark border-mehran-gold/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">اسم المطعم بالإنجليزية</Label>
                <Input
                  value={settings.restaurantNameEn}
                  onChange={(e) => setSettings((prev) => ({ ...prev, restaurantNameEn: e.target.value }))}
                  className="bg-mehran-dark border-mehran-gold/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">الشعار</Label>
                <div className="flex items-center gap-4">
                  {settings.logo && (
                    <img
                      src={settings.logo || "/placeholder.svg"}
                      alt="Logo"
                      className="w-16 h-16 object-contain rounded-lg bg-mehran-dark"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mehran-gold/20 text-mehran-gold cursor-pointer hover:bg-mehran-gold/30 transition-colors">
                    {isUploadingLogo ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    <span>رفع شعار</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">صورة الغلاف</Label>
                <div className="flex items-center gap-4">
                  {settings.heroImage && (
                    <img
                      src={settings.heroImage || "/placeholder.svg"}
                      alt="Hero"
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mehran-gold/20 text-mehran-gold cursor-pointer hover:bg-mehran-gold/30 transition-colors">
                    {isUploadingHero ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                    <span>رفع غلاف</span>
                    <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="bg-mehran-dark-light border-mehran-gold/20">
          <CardHeader>
            <CardTitle className="text-white">معلومات التواصل</CardTitle>
            <CardDescription className="text-gray-400">رقم الهاتف والعنوان</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">رقم الهاتف</Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  className="bg-mehran-dark border-mehran-gold/20 text-white"
                  placeholder="+970 XXX XXX XXX"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">ساعات العمل</Label>
                <Input
                  value={settings.workingHours}
                  onChange={(e) => setSettings((prev) => ({ ...prev, workingHours: e.target.value }))}
                  className="bg-mehran-dark border-mehran-gold/20 text-white"
                  placeholder="10:00 AM - 11:00 PM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">العنوان</Label>
              <Textarea
                value={settings.address}
                onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                className="bg-mehran-dark border-mehran-gold/20 text-white"
                placeholder="العنوان الكامل للمطعم"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="bg-mehran-dark-light border-mehran-gold/20">
          <CardHeader>
            <CardTitle className="text-white">إعدادات الأسعار</CardTitle>
            <CardDescription className="text-gray-400">نسبة الخدمة والعملة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">نسبة الخدمة (%)</Label>
                <Input
                  type="number"
                  value={settings.serviceCharge}
                  onChange={(e) => setSettings((prev) => ({ ...prev, serviceCharge: Number(e.target.value) }))}
                  className="bg-mehran-dark border-mehran-gold/20 text-white"
                  min={0}
                  max={100}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">العملة</Label>
                <Input
                  value={settings.currency}
                  onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
                  className="bg-mehran-dark border-mehran-gold/20 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-mehran-gold text-mehran-dark hover:bg-mehran-gold/90"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="ml-2" size={18} />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
