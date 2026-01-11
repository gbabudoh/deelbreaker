'use client';

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', {
      path: '/api/socket'
    })

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}

export const useDealUpdates = (dealId: string) => {
  const { socket } = useSocket()
  const [dealData, setDealData] = useState<any>(null)
  const [participants, setParticipants] = useState<number>(0)
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  useEffect(() => {
    if (!socket || !dealId) return

    // Join the deal room
    socket.emit('join-deal', dealId)

    // Listen for deal updates
    socket.on('deal-updated', (data) => {
      setDealData(data)
    })

    socket.on('group-buy-progress', (data) => {
      setParticipants(data.participants)
    })

    socket.on('price-updated', (data) => {
      setCurrentPrice(data.price)
    })

    return () => {
      socket.emit('leave-deal', dealId)
      socket.off('deal-updated')
      socket.off('group-buy-progress')
      socket.off('price-updated')
    }
  }, [socket, dealId])

  return {
    dealData,
    participants,
    currentPrice
  }
}

export const useUserNotifications = (userId: string) => {
  const { socket } = useSocket()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!socket || !userId) return

    // Join user room
    socket.emit('join-user', userId)

    // Listen for notifications
    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
    })

    return () => {
      socket.off('notification')
    }
  }, [socket, userId])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    )
  }

  return {
    notifications,
    markAsRead
  }
}