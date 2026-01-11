import { NextRequest } from 'next/server'
import { initializeWebSocket } from '@/lib/websocket'

export async function GET(request: NextRequest) {
  // This endpoint is used to initialize WebSocket connection
  // The actual WebSocket server is initialized in the custom server
  return new Response('WebSocket server should be running', { status: 200 })
}