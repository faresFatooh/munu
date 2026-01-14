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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, X, ImageIcon, Upload, Sparkles } from "lucide-react"
import Image from "next/image"
import type { MenuItem, Category, PriceOption } from "@/types/menu"
import { uploadImage } from "@/lib/cloudinary"

export default function MenuItemsPage() {
  const { user } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    image: "",
    categoryId: "",
    isAvailable: true,
    prices: [{ label: "", price: 0 }] as PriceOption[],
    order: 0,
  })

  useEffect(() => {
    const itemsRef = ref(database, "menuItems")
    const categoriesRef = ref(database, "categories")

    const unsubItems = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const itemsArray = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          ...item,
        }))
        setMenuItems(itemsArray.sort((a, b) => a.order - b.order))
      } else {
        setMenuItems([])
      }
      setLoading(false)
    })

    const unsubCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const categoriesArray = Object.entries(data).map(([id, cat]: [string, any]) => ({
          id,
          ...cat,
        }))
        setCategories(categoriesArray.sort((a, b) => a.order - b.order))
      }
    })

    return () => {
      unsubItems()
      unsubCategories()
    }
  }, [])

  const resetForm = () => {
    setFormData({
      nameAr: "",
      nameEn: "",
      description: "",
      image: "",
      categoryId: categories[0]?.id || "",
      isAvailable: true,
      prices: [{ label: "", price: 0 }],
      order: menuItems.length,
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      description: item.description || "",
      image: item.image || "",
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
      prices: item.prices,
      order: item.order,
    })
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const imageUrl = await uploadImage(file)
        setFormData((prev) => ({ ...prev, image: imageUrl }))
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.")
      }
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }))
  }

  const addPriceOption = () => {
    setFormData((prev) => ({
      ...prev,
      prices: [...prev.prices, { label: "", price: 0 }],
    }))
  }

  const removePriceOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index),
    }))
  }

  const updatePriceOption = (index: number, field: "label" | "price", value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      prices: prev.prices.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const itemsRef = ref(database, "menuItems")

      if (editingItem) {
        const itemRef = ref(database, `menuItems/${editingItem.id}`)
        await update(itemRef, formData)
      } else {
        await push(itemsRef, {
          ...formData,
          order: menuItems.length,
        })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving item:", error)
    }

    setIsSaving(false)
  }

  const handleDelete = async (itemId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الصنف؟")) {
      try {
        await remove(ref(database, `menuItems/${itemId}`))
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const toggleAvailable = async (item: MenuItem) => {
    try {
      await update(ref(database, `menuItems/${item.id}`), {
        isAvailable: !item.isAvailable,
      })
    } catch (error) {
      console.error("Error toggling item:", error)
    }
  }

  const filteredItems =
    filterCategory === "all" ? menuItems : menuItems.filter((item) => item.categoryId === filterCategory)

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.nameAr || "غير محدد"
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader user={user} title="إدارة الأصناف" />

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-400">إدارة أصناف المنيو مع دعم الصور</p>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 bg-mehran-dark border-mehran-gold/20 text-white">
                <SelectValue placeholder="كل الأقسام" />
              </SelectTrigger>
              <SelectContent className="bg-mehran-dark-light border-mehran-gold/20">
                <SelectItem value="all" className="text-white">
                  كل الأقسام
                </SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-white">
                    {cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-gradient-to-r from-mehran-gold to-mehran-gold-light text-mehran-dark hover:shadow-lg hover:shadow-mehran-gold/30 transition-all"
              >
                <Plus className="ml-2" size={18} />
                إضافة صنف
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-mehran-dark-light border-mehran-gold/20 text-white max-h-[90vh] overflow-y-auto max-w-2xl"
              dir="rtl"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-mehran-gold" />
                  {editingItem ? "تعديل الصنف" : "إضافة صنف جديد"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الاسم بالعربية</Label>
                    <Input
                      value={formData.nameAr}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                      className="bg-mehran-dark border-mehran-gold/20 focus:border-mehran-gold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>الاسم بالإنجليزية</Label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                      className="bg-mehran-dark border-mehran-gold/20 focus:border-mehran-gold"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>الوصف (اختياري)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="bg-mehran-dark border-mehran-gold/20 focus:border-mehran-gold"
                    rows={2}
                    placeholder="وصف قصير للصنف..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>القسم</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger className="bg-mehran-dark border-mehran-gold/20">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent className="bg-mehran-dark-light border-mehran-gold/20">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white">
                          {cat.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-mehran-gold" />
                    صورة الصنف
                  </Label>

                  {formData.image ? (
                    <div className="relative group">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-mehran-gold/20">
                        <Image src={formData.image || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="cursor-pointer p-2 rounded-lg bg-mehran-gold/20 text-mehran-gold hover:bg-mehran-gold hover:text-mehran-dark transition-all">
                            <Upload size={20} />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-2 rounded-lg bg-mehran-red/20 text-mehran-red hover:bg-mehran-red hover:text-white transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">حرك الماوس على الصورة لتغييرها أو حذفها</p>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-mehran-gold/30 rounded-xl p-8 text-center hover:border-mehran-gold/60 hover:bg-mehran-gold/5 transition-all">
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-mehran-gold animate-spin" />
                            <p className="text-mehran-gold">جاري رفع الصورة...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-mehran-gold/10">
                              <Upload className="w-8 h-8 text-mehran-gold" />
                            </div>
                            <div>
                              <p className="text-white font-medium">اضغط لرفع صورة</p>
                              <p className="text-gray-500 text-sm">PNG, JPG حتى 5MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  )}
                </div>

                {/* Prices */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>الأسعار</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addPriceOption}
                      className="text-mehran-gold hover:bg-mehran-gold/10"
                    >
                      <Plus size={16} className="ml-1" />
                      إضافة سعر
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.prices.map((price, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          placeholder="الحجم (مثال: صغير)"
                          value={price.label}
                          onChange={(e) => updatePriceOption(index, "label", e.target.value)}
                          className="bg-mehran-dark border-mehran-gold/20 flex-1"
                          required
                        />
                        <Input
                          type="number"
                          placeholder="السعر"
                          value={price.price || ""}
                          onChange={(e) => updatePriceOption(index, "price", Number(e.target.value))}
                          className="bg-mehran-dark border-mehran-gold/20 w-24"
                          required
                        />
                        <span className="text-mehran-gold">₪</span>
                        {formData.prices.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removePriceOption(index)}
                            className="text-red-400 hover:bg-red-400/10"
                          >
                            <X size={18} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-mehran-dark border border-mehran-gold/10">
                  <Label className="cursor-pointer">الصنف متوفر</Label>
                  <Switch
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAvailable: checked }))}
                  />
                </div>

                <DialogFooter className="gap-2 pt-4">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-mehran-gold/20 text-gray-300 bg-transparent hover:bg-mehran-gold/10"
                    >
                      إلغاء
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-mehran-gold to-mehran-gold-light text-mehran-dark"
                    disabled={isSaving || isUploading}
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : editingItem ? (
                      "حفظ التعديلات"
                    ) : (
                      "إضافة الصنف"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-mehran-gold animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="bg-mehran-dark-light border-mehran-gold/20">
            <CardContent className="py-12 text-center">
              <ImageIcon className="w-16 h-16 text-mehran-gold/30 mx-auto mb-4" />
              <p className="text-gray-400">لا توجد أصناف بعد. أضف صنفك الأول مع صورة!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="bg-mehran-dark-card border-mehran-gold/10 overflow-hidden hover:border-mehran-gold/30 transition-all group"
              >
                {/* Item Image */}
                <div className="relative h-40 bg-mehran-dark-light">
                  {item.image ? (
                    <>
                      <Image src={item.image || "/placeholder.svg"} alt={item.nameAr} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-mehran-dark-card to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-mehran-gold/20" />
                    </div>
                  )}
                  {/* Availability badge */}
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${item.isAvailable ? "bg-mehran-green/20 text-mehran-green" : "bg-mehran-red/20 text-mehran-red"}`}
                    >
                      {item.isAvailable ? "متوفر" : "غير متوفر"}
                    </span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">{item.nameAr}</h3>
                      <p className="text-sm text-gray-400 truncate">{item.nameEn}</p>
                      <p className="text-xs text-mehran-gold mt-1">{getCategoryName(item.categoryId)}</p>
                    </div>
                    <Switch checked={item.isAvailable} onCheckedChange={() => toggleAvailable(item)} />
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 mb-3">
                    {item.prices.slice(0, 3).map((price, idx) => (
                      <span key={idx} className="text-xs bg-mehran-dark px-2 py-1 rounded text-mehran-gold">
                        {price.label}: {price.price}₪
                      </span>
                    ))}
                    {item.prices.length > 3 && <span className="text-xs text-gray-500">+{item.prices.length - 3}</span>}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                      className="flex-1 text-mehran-gold hover:bg-mehran-gold/10"
                    >
                      <Pencil size={16} className="ml-1" />
                      تعديل
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 size={16} />
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
}
