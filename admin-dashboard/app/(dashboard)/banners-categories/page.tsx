'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Image as ImageIcon, Tag, AlertCircle, Calendar } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  isActive: boolean
}

interface Banner {
  id: string
  title: string
  description: string | null
  imageUrl: string
  linkUrl: string | null
  isActive: boolean
  startDate: string | null
  endDate: string | null
}

export default function BannersCategoriesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'banners'>('categories')
  
  // Category States
  const [categories, setCategories] = useState<Category[]>([])
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catIcon, setCatIcon] = useState('Tag')
  
  // Banner States
  const [banners, setBanners] = useState<Banner[]>([])
  const [banTitle, setBanTitle] = useState('')
  const [banDesc, setBanDesc] = useState('')
  const [banImg, setBanImg] = useState('')
  const [banLink, setBanLink] = useState('')
  const [banStart, setBanStart] = useState('')
  const [banEnd, setBanEnd] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeTab === 'categories') {
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        setCategories(data)
      } else {
        const res = await fetch('/api/banners')
        if (!res.ok) throw new Error('Failed to fetch banners')
        const data = await res.json()
        setBanners(data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName || !catSlug) return

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, slug: catSlug, description: catDesc, icon: catIcon }),
      })
      if (!res.ok) throw new Error('Failed to add category')
      const data = await res.json()
      setCategories((prev) => [...prev, data])
      setCatName('')
      setCatSlug('')
      setCatDesc('')
      setCatIcon('Tag')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleToggleCategory = async (cat: Category) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cat.id, isActive: !cat.isActive }),
      })
      if (!res.ok) throw new Error('Failed to update category')
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !cat.isActive } : c))
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete category')
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!banTitle || !banImg) return

    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: banTitle,
          description: banDesc,
          imageUrl: banImg,
          linkUrl: banLink,
          startDate: banStart || null,
          endDate: banEnd || null,
        }),
      })
      if (!res.ok) throw new Error('Failed to add banner')
      const data = await res.json()
      setBanners((prev) => [data, ...prev])
      setBanTitle('')
      setBanDesc('')
      setBanImg('')
      setBanLink('')
      setBanStart('')
      setBanEnd('')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleToggleBanner = async (banner: Banner) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
      })
      if (!res.ok) throw new Error('Failed to update banner')
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: !banner.isActive } : b))
      )
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete banner')
      setBanners((prev) => prev.filter((b) => b.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">Banners & Categories</h1>
          <p className="mt-2 text-sm text-zinc-400">Configure search classifications and promotional graphics.</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tag className="h-4 w-4" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Promo Banners
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Main Split Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* CREATE FORM */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
            {activeTab === 'categories' ? 'Add Class Category' : 'Create Promo Banner'}
          </h3>

          {activeTab === 'categories' ? (
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value)
                    setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                  }}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="e.g. Health & Fitness"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="health-fitness"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Icon Identifier (Lucide Icon name)
                </label>
                <input
                  type="text"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Tag"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors h-24 resize-none"
                  placeholder="Classification brief..."
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer font-sans"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Banner Title
                </label>
                <input
                  type="text"
                  required
                  value={banTitle}
                  onChange={(e) => setBanTitle(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="e.g. Summer Black Friday Sale"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Image URL
                </label>
                <input
                  type="text"
                  required
                  value={banImg}
                  onChange={(e) => setBanImg(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Navigation Target (Link URL)
                </label>
                <input
                  type="text"
                  value={banLink}
                  onChange={(e) => setBanLink(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="/deals?featured=true"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={banDesc}
                  onChange={(e) => setBanDesc(e.target.value)}
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  placeholder="Up to 50% cashbacks on Tech items"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={banStart}
                    onChange={(e) => setBanStart(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={banEnd}
                    onChange={(e) => setBanEnd(e.target.value)}
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer font-sans"
              >
                <Plus className="h-4 w-4" />
                Create Banner
              </button>
            </form>
          )}
        </div>

        {/* LIST VIEW */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-zinc-800 pb-4">
            {activeTab === 'categories' ? 'Class Classifications' : 'Promo Banners List'}
          </h3>

          {loading ? (
            <div className="flex py-20 justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          ) : activeTab === 'categories' ? (
            <div className="overflow-x-auto">
              {categories.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">No categories found. Add one above.</div>
              ) : (
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      <th className="pb-3">Classification</th>
                      <th className="pb-3">Slug</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-zinc-800/10">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                              <Tag className="h-4 w-4" />
                            </span>
                            <div>
                              <div className="font-semibold text-zinc-200">{cat.name}</div>
                              <div className="text-xs text-zinc-500">{cat.description || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-mono text-xs text-zinc-400">{cat.slug}</td>
                        <td className="py-4 text-center">
                          <button
                            onClick={() => handleToggleCategory(cat)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all cursor-pointer ${
                              cat.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {banners.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">No promo banners configured. Create one above.</div>
              ) : (
                banners.map((ban) => (
                  <div
                    key={ban.id}
                    className="flex flex-col sm:flex-row border border-zinc-800 bg-zinc-900/60 p-4 rounded-2xl gap-4 hover:border-zinc-700 transition-colors"
                  >
                    {/* Banner Image Preview */}
                    <div className="relative h-20 w-full sm:w-36 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shrink-0">
                      <img src={ban.imageUrl} alt={ban.title} className="h-full w-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-white truncate">{ban.title}</h4>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{ban.description || 'No description'}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteBanner(ban.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer shrink-0"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-500">
                        {ban.linkUrl && (
                          <span className="font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 rounded px-1.5 py-0.5">
                            Link: {ban.linkUrl}
                          </span>
                        )}
                        {(ban.startDate || ban.endDate) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {ban.startDate ? new Date(ban.startDate).toLocaleDateString() : 'Start'} -{' '}
                            {ban.endDate ? new Date(ban.endDate).toLocaleDateString() : 'End'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active State Toggle */}
                    <div className="flex items-center sm:border-l sm:border-zinc-800 sm:pl-4 shrink-0 justify-end">
                      <button
                        onClick={() => handleToggleBanner(ban)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          ban.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                        }`}
                      >
                        {ban.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
