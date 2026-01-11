// @ts-ignore - Module resolution issue
import { Server as SocketIOServer } from 'socket.io'
// @ts-ignore - Module resolution issue
import { Server as NetServer } from 'http'
// @ts-ignore - Module resolution issue
import { NextApiResponse } from 'next'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export const initializeWebSocket = (server: NetServer) => {
  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join deal-specific rooms for real-time updates
    socket.on('join-deal', (dealId: string) => {
      socket.join(`deal-${dealId}`)
      console.log(`Client ${socket.id} joined deal room: ${dealId}`)
    })

    // Leave deal room
    socket.on('leave-deal', (dealId: string) => {
      socket.leave(`deal-${dealId}`)
      console.log(`Client ${socket.id} left deal room: ${dealId}`)
    })

    // Join user-specific room for notifications
    socket.on('join-user', (userId: string) => {
      socket.join(`user-${userId}`)
      console.log(`Client ${socket.id} joined user room: ${userId}`)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  return io
}

// Utility functions for emitting events
export const emitDealUpdate = (io: SocketIOServer, dealId: string, data: any) => {
  io.to(`deal-${dealId}`).emit('deal-updated', data)
}

export const emitGroupBuyProgress = (io: SocketIOServer, dealId: string, data: any) => {
  io.to(`deal-${dealId}`).emit('group-buy-progress', data)
}

export const emitPriceUpdate = (io: SocketIOServer, dealId: string, data: any) => {
  io.to(`deal-${dealId}`).emit('price-updated', data)
}

export const emitUserNotification = (io: SocketIOServer, userId: string, notification: any) => {
  io.to(`user-${userId}`).emit('notification', notification)
}