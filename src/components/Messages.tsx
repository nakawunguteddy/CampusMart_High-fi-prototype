import { useState, useEffect } from 'react';
import { Send, ArrowLeft, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MessagesProps {
  onNavigate: (page: string) => void;
}

interface Conversation {
  listingId: string;
  listingTitle: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export default function Messages({ onNavigate }: MessagesProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.listingId, selectedConversation.otherUserId);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!user) return;
    setLoading(true);

    const { data: sentMessages } = await supabase
      .from('messages')
      .select('*, listings(title), profiles!messages_receiver_id_fkey(full_name)')
      .eq('sender_id', user.id)
      .order('created_at', { ascending: false });

    const { data: receivedMessages } = await supabase
      .from('messages')
      .select('*, listings(title), profiles!messages_sender_id_fkey(full_name)')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    const conversationMap = new Map<string, Conversation>();

    sentMessages?.forEach((msg: any) => {
      const key = `${msg.listing_id}-${msg.receiver_id}`;
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          listingId: msg.listing_id,
          listingTitle: msg.listings?.title || 'Unknown',
          otherUserId: msg.receiver_id,
          otherUserName: msg.profiles?.full_name || 'Unknown',
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          unreadCount: 0,
        });
      }
    });

    receivedMessages?.forEach((msg: any) => {
      const key = `${msg.listing_id}-${msg.sender_id}`;
      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          listingId: msg.listing_id,
          listingTitle: msg.listings?.title || 'Unknown',
          otherUserId: msg.sender_id,
          otherUserName: msg.profiles?.full_name || 'Unknown',
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          unreadCount: msg.read ? 0 : 1,
        });
      }
    });

    setConversations(Array.from(conversationMap.values()));
    setLoading(false);
  };

  const loadMessages = async (listingId: string, otherUserId: string) => {
    if (!user) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('listing_id', listingId)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);

    await supabase
      .from('messages')
      .update({ read: true })
      .eq('listing_id', listingId)
      .eq('receiver_id', user.id)
      .eq('sender_id', otherUserId);
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    await supabase.from('messages').insert({
      listing_id: selectedConversation.listingId,
      sender_id: user.id,
      receiver_id: selectedConversation.otherUserId,
      content: newMessage,
    });

    setNewMessage('');
    loadMessages(selectedConversation.listingId, selectedConversation.otherUserId);
    loadConversations();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            <div className="border-r border-gray-200 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600">No messages yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {conversations.map((conv, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedConversation?.listingId === conv.listingId &&
                        selectedConversation?.otherUserId === conv.otherUserId
                          ? 'bg-blue-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {conv.otherUserName}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {conv.listingTitle}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {conv.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedConversation.otherUserName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.listingTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                            msg.sender_id === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.sender_id === user?.id
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
