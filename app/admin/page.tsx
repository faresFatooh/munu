"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UtensilsCrossed, Tags, TrendingUp, Eye } from "lucide-react"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    activeItems: 0,
    views: 0,
  })

  useEffect(() => {
    const itemsRef = ref(database, "menuItems")
    const categoriesRef = ref(database, "categories")
    const statsRef = ref(database, "stats")

    const unsubItems = onValue(itemsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const items = Object.values(data) as any[]
        setStats((prev) => ({
          ...prev,
          totalItems: items.length,
          activeItems: items.filter((i) => i.isAvailable).length,
        }))
      }
    })

    const unsubCategories = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setStats((prev) => ({
          ...prev,
          totalCategories: Object.keys(data).length,
        }))
      }
    })

    const unsubStats = onValue(statsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setStats((prev) => ({
          ...prev,
          views: data.views || 0,
        }))
      }
    })

    return () => {
      unsubItems()
      unsubCategories()
      unsubStats()
    }
  }, [])

  const statCards = [
    {
      title: "إجمالي الأصناف",
      value: stats.totalItems,
      icon: UtensilsCrossed,
      color: "text-mehran-gold",
      bgColor: "bg-mehran-gold/10",
    },
    {
      title: "الأقسام",
      value: stats.totalCategories,
      icon: Tags,
      color: "text-mehran-green",
      bgColor: "bg-mehran-green/10",
    },
    {
      title: "الأصناف المتوفرة",
      value: stats.activeItems,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "المشاهدات",
      value: stats.views,
      icon: Eye,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <AdminHeader user={user} title="لوحة التحكم" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card key={index} className="bg-mehran-dark-light border-mehran-gold/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={card.color} size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-mehran-dark-light border-mehran-gold/20">
          <CardHeader>
            <CardTitle className="text-white">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/menu-items"
              className="p-4 rounded-lg bg-mehran-gold/10 hover:bg-mehran-gold/20 transition-colors border border-mehran-gold/20 text-center"
            >
              <UtensilsCrossed className="mx-auto text-mehran-gold mb-2" size={32} />
              <p className="text-white font-medium">إضافة صنف جديد</p>
            </a>
            <a
              href="/admin/categories"
              className="p-4 rounded-lg bg-mehran-green/10 hover:bg-mehran-green/20 transition-colors border border-mehran-green/20 text-center"
            >
              <Tags className="mx-auto text-mehran-green mb-2" size={32} />
              <p className="text-white font-medium">إدارة الأقسام</p>
            </a>
            <a
              href="/"
              target="_blank"
              className="p-4 rounded-lg bg-blue-400/10 hover:bg-blue-400/20 transition-colors border border-blue-400/20 text-center"
              rel="noreferrer"
            >
              <Eye className="mx-auto text-blue-400 mb-2" size={32} />
              <p className="text-white font-medium">معاينة المنيو</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
