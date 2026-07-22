// FILE: app/components/FloatingChat.tsx
// Persistent floating chat button for community interaction

'use client'
import { useState } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      author: 'Sarah',
      message: 'Just found a 15% APY on Lido. Anyone else farming stETH?',
      timestamp: '2 min ago',
      avatar: '👩'
    },
    {
      id: 2,
      author: 'Alex',
      message: 'That APY looks suspicious. Check the protocol carefully!',
      timestamp: '1 min ago',
      avatar: '👨'
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        author: 'You',
        message: newMessage,
        timestamp: 'now',
        avatar: '🌾'
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
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
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageSquare size={24} className="text-[#0a0a0a]" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border-2 border-[#00ffe0] z-40 flex flex-col h-[600px] animate-in fade-in slide-in-from-bottom-4">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] text-white p-4 rounded-t-lg">
            <h3 className="font-bold font-mono">Farmers Chatroom</h3>
            <p className="text-xs text-gray-300 mt-1">Share strategies, ask questions, help each other</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl">{msg.avatar}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-[#0a0a0a]">{msg.author}</span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 ml-9">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#00ffe0]"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#00ffe0] hover:bg-[#00ccb3] text-[#0a0a0a] font-bold p-2 rounded-lg transition-all"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">
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
