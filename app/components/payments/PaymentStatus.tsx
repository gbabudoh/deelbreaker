'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react'

interface PaymentStatusProps {
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  amount: number
  orderNumber: string
  timestamp?: Date
}

export function PaymentStatus({
  status,
  amount,
  orderNumber,
  timestamp
}: PaymentStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      label: 'Payment Pending'
    },
    paid: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      label: 'Payment Successful'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      label: 'Payment Failed'
    },
    refunded: {
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      label: 'Refunded'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} border ${config.borderColor} rounded-lg p-6`}
    >
      <div className="flex items-start gap-4">
        <Icon className={`w-6 h-6 ${config.color} flex-shrink-0 mt-1`} />
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.color} mb-1`}>
            {config.label}
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">Order Number:</span> {orderNumber}
            </p>
            <p>
              <span className="font-medium">Amount:</span> ${amount.toFixed(2)}
            </p>
            {timestamp && (
              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Date(timestamp).toLocaleDateString()} at{' '}
                {new Date(timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
