'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Package, MapPin, Laptop, Tag, ShieldCheck, Zap } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { items, totalCount, removeFromCart, updateQuantity, addToCart } = useCart();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0);
  const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const savings = originalTotal - subtotal;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart</h1>
            <p className="text-gray-400 text-sm">
              {totalCount === 0 ? 'No items yet' : `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-9 h-9 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mb-6">Browse deals and click "Add to Cart" to get started</p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all"
            >
              <Zap className="w-4 h-4" />
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">

            {/* Cart Items */}
            <div className="lg:col-span-3 space-y-3">
              <AnimatePresence initial={false}>
                {items.map(item => {
                  const TypeIcon = item.type === 'PHYSICAL_PRODUCT' ? Package
                    : item.type === 'LOCAL_SERVICE' ? MapPin : Laptop;
                  const typeLabel = item.type === 'PHYSICAL_PRODUCT' ? 'Physical'
                    : item.type === 'LOCAL_SERVICE' ? 'Local Service' : 'Digital';
                  const typeColor = item.type === 'PHYSICAL_PRODUCT'
                    ? 'bg-indigo-50 text-indigo-700'
                    : item.type === 'LOCAL_SERVICE'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700';

                  return (
                    <motion.div
                      key={String(item.id)}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.18 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-black px-1 py-0.5 rounded">
                          -{item.discount}%
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{item.title}</h3>
                            <p className="text-xs text-gray-400 mt-0.5">{item.merchant}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor}`}>
                            <TypeIcon className="w-3 h-3" />
                            {typeLabel}
                          </span>

                          <div className="flex items-center gap-3">
                            {/* Quantity controls */}
                            <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-100">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-bold text-gray-900 w-5 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 hover:border-[#F3AF7B] hover:text-[#F3AF7B] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line price */}
                            <div className="text-right min-w-16">
                              <p className="font-black text-gray-900 text-sm">
                                ${(item.currentPrice * item.quantity).toFixed(2)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-[10px] text-gray-400">${item.currentPrice} each</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <Link
                href="/deals"
                className="inline-flex items-center gap-1.5 text-sm text-[#F3AF7B] font-semibold hover:underline pt-1"
              >
                <Zap className="w-4 h-4" />
                Continue shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 text-base mb-5">Order Summary</h2>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-gray-500">
                    <span>Original total</span>
                    <span className="line-through">${originalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Discount saved
                    </span>
                    <span>−${savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery</span>
                    <span className="text-green-600 font-bold text-xs uppercase tracking-wide">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Service fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="font-black text-gray-900">Total</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">Incl. VAT</p>
                    </div>
                    <p className="text-2xl font-black text-gray-900">${subtotal.toFixed(2)}</p>
                  </div>
                </div>

                {/* Savings pill */}
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl py-2.5 mb-5">
                  <Tag className="w-3.5 h-3.5 text-green-600" />
                  <p className="text-xs font-bold text-green-700">
                    You save <span className="text-green-800">${savings.toFixed(2)}</span> on this order
                  </p>
                </div>

                {/* Checkout buttons */}
                {items.length === 1 ? (
                  <button
                    onClick={() => router.push(`/checkout/${items[0].id}?quantity=${items[0].quantity}`)}
                    className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#F3AF7B] to-[#F4C2B8] hover:from-[#e09153] hover:to-[#e8a89e] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-orange-100"
                  >
                    <Zap className="w-4 h-4" />
                    Checkout · ${subtotal.toFixed(2)}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-400 text-center mb-3 font-medium">
                      Checkout each item separately
                    </p>
                    {items.map(item => (
                      <button
                        key={String(item.id)}
                        onClick={() => router.push(`/checkout/${item.id}?quantity=${item.quantity}`)}
                        className="w-full flex items-center justify-between gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-xl font-semibold text-xs transition-all"
                      >
                        <span className="truncate text-left">{item.title}</span>
                        <span className="shrink-0 flex items-center gap-1 font-black">
                          <Zap className="w-3 h-3" />
                          ${(item.currentPrice * item.quantity).toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  <span>Buyer protected · SSL secured</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
