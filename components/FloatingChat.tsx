// FILE: app/components/FloatingChat.tsx
// Persistent floating chat button - LIVE with real-time Supabase updates

'use client'
import { useState, useEffect } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface ChatMessage {
  id: string
  author: string
  message: string
  created_at: string
  avatar?: string
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('Farmer')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPA_URL!,
    process.env.NEXT_PUBLIC_SUPA_KEY!
  )

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_messages' 
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages(prev => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      setMessages(data || [])
    } catch (err) {
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          author: userName,
          message: newMessage,
          avatar: '🌾'
        })

      if (error) {
        console.error('Error sending message:', error)
        return
      }

      setNewMessage('')
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)
    
    if (diffMinutes < 1) return 'now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all z-40 flex items-center justify-center font-bold text-white ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-[#00ffe0] hover:bg-[#00ccb3]'
        }`}
        title="Open farmers chat"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <>
            <MessageSquare size={24} className="text-[#0a0a0a]" />
            {messages.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages.length > 99 ? '99+' : messages.length}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border-2 border-[#00ffe0] z-40 flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] text-white p-4 rounded-t-lg">
            <h3 className="font-bold font-mono">🌾 Farmers Chatroom</h3>
            <p className="text-xs text-gray-300 mt-1">
              {loading ? 'Loading messages...' : `${messages.length} messages • Live updates`}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p className="font-mono text-sm">Loading chat...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-center">
                <div>
                  <p className="font-mono text-sm mb-2">Be the first to chat!</p>
                  <p className="text-xs">Share your strategies and help fellow farmers.</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-[#00ffe0] transition-colors">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xl">{msg.avatar || '👨'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-sm text-[#0a0a0a] truncate">{msg.author}</span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{formatTime(msg.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 ml-9 break-words">{msg.message}</p>
                </div>
              ))
            )}
            {/* Auto-scroll to bottom */}
            <div className="h-1" />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg space-y-2">
            {/* Name Input */}
            <input
              type="text"
              placeholder="Your name (optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-[#00ffe0]"
            />
            
            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                maxLength={200}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#00ffe0]"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-[#00ffe0] hover:bg-[#00ccb3] disabled:bg-gray-300 text-[#0a0a0a] font-bold p-2 rounded-lg transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 font-mono">
              💡 Real farmers, real strategies. No spam.
            </p>
          </div>

        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}