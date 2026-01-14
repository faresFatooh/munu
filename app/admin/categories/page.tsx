"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ref, onValue, push, update, remove } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react"
import type { Category } from "@/types/menu"
import { uploadImage } from "@/lib/cloudinary"

export default function CategoriesPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    image: "",
    isActive: true,
    order: 0,
  })

  useEffect(() => {
    const categoriesRef = ref(database, "categories")
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const categoriesArray = Object.entries(data).map(([id, cat]: [string, any]) => ({
          id,
          ...cat,
        }))
        setCategories(categoriesArray.sort((a, b) => a.order - b.order))
      } else {
        setCategories([])
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const resetForm = () => {
    setFormData({
      nameAr: "",
      nameEn: "",
      image: "",
      isActive: true,
      order: categories.length,
    })
    setEditingCategory(null)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      nameAr: category.nameAr || "",
      nameEn: category.nameEn || "",
      image: category.image || "",
      isActive: category.isActive ?? true,
      order: category.order || 0,
    })
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsSaving(true)
      try {
        const imageUrl = await uploadImage(file)
        if (imageUrl) {
          setFormData((prev) => ({ ...prev, image: imageUrl }))
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("فشل رفع الصورة. تأكد من إعدادات Cloudinary")
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // حماية: نضمن أن القيم ليست undefined قبل الإرسال لـ Firebase
      const cleanData = {
        nameAr: formData.nameAr || "",
        nameEn: formData.nameEn || "",
        image: formData.image || "",
        isActive: formData.isActive,
        order: formData.order ?? categories.length,
      }

      if (editingCategory) {
        await update(ref(database, `categories/${editingCategory.id}`), cleanData)
      } else {
        await push(ref(database, "categories"), cleanData)
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving category:", error)
      alert("حدث خطأ أثناء الحفظ")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      try {
        await remove(ref(database, `categories/${categoryId}`))
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const toggleActive = async (category: Category) => {
    try {
      await update(ref(database, `categories/${category.id}`), {
        isActive: !category.isActive,
      })
    } catch (error) {
      console.error("Error toggling category:", error)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader user={user} title="إدارة الأقسام" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">إدارة أقسام المنيو</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-mehran-gold text-mehran-dark hover:bg-mehran-gold/90">
                <Plus className="ml-2" size={18} />
                إضافة قسم
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-mehran-dark-light border-mehran-gold/20 text-white" dir="rtl">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "تعديل القسم" : "إضافة قسم جديد"}</DialogTitle>
                <DialogDescription className="text-gray-400">أضف أو عدل بيانات القسم هنا.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>الاسم بالعربية</Label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                    className="bg-mehran-dark border-mehran-gold/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الاسم بالإنجليزية</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                    className="bg-mehran-dark border-mehran-gold/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>صورة القسم</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-mehran-dark border-mehran-gold/20"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg mt-2 border border-mehran-gold/30"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <Label>نشط</Label>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                  />
                </div>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="border-mehran-gold/20 text-gray-300">
                      إلغاء
                    </Button>
                  </DialogClose>
                  <Button type="submit" className="bg-mehran-gold text-mehran-dark" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : (editingCategory ? "حفظ" : "إضافة")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-mehran-gold animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <Card key={category.id} className="bg-mehran-dark-light border-mehran-gold/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <GripVertical className="text-gray-500 cursor-grab" size={20} />
                  {category.image && (
                    <img src={category.image} alt={category.nameAr} className="w-12 h-12 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{category.nameAr}</h3>
                    <p className="text-sm text-gray-400">{category.nameEn}</p>
                  </div>
                  <Switch checked={category.isActive} onCheckedChange={() => toggleActive(category)} />
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)} className="text-mehran-gold">
                      <Pencil size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} className="text-red-400">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}git add .