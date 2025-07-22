'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Student 1',
      content: 'Hello',
      timestamp: new Date(),
    },
  ]);

  const [socket, setSocket] = useState<Socket | null>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.email || !selectedUser?.email) return;

    setMessages([]);

    const newSocket = io('http://localhost:3030', {
      query: {
        senderEmail: currentUser.email,
        receiverEmail: selectedUser.email,
      },
    });

    newSocket.on('chatMessage', (data: any) => {
      if (data.sender !== currentUser.email) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id || Date.now().toString(),
            sender: data.sender,
            content: data.message,
            timestamp: new Date(data.timestamp),
          },
        ]);
      }
    });

    newSocket.on('chatHistory', (history: any[]) => {
      const formattedHistory = history.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender === currentUser.email ? 'You' : msg.sender,
        content: msg.message,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(formattedHistory);
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket, requesting chat history...');
      newSocket.emit('requestChatHistory');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [selectedUser, currentUser]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      console.log('Message is empty');
      return;
    }

    if (!selectedUser) {
      console.log('No user selected');
      return;
    }

    if (!currentUser?.email) {
      console.log('Current user email not found');
      return;
    }

    const messageToSend = message;
    setMessage('');

    if (socket && socket.connected) {
      const payload = {
        sender: currentUser.email,
        receiver: selectedUser.email,
        message: messageToSend,
      };

      socket.emit('chatMessage', payload);
      console.log('Message sent via socket:', payload);

      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: messageToSend,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    } else {
      console.log('Socket not connected, message saved locally only');
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        content: messageToSend,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/get-students`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) {
        console.error('Failed to fetch students');
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <div className="flex flex-col w-96 bg-white border-r border-gray-200">
        <div className="flex flex-col gap-3 p-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">All Message</h2>
          <Input placeholder="Search..." className="w-full" />
        </div>

        <div className="flex flex-col overflow-y-auto h-full">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex flex-col min-w-0 flex-grow">
                <span className="font-medium text-gray-900 truncate">
                  {user.name}
                </span>
                <span className="text-sm text-gray-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-grow min-w-0">
        {selectedUser ? (
          <>
            <div className="flex items-center p-4 bg-white border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-300 rounded-full mr-4 flex-shrink-0">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg truncate">
                  {selectedUser.name}
                </h3>
              </div>
            </div>

            <div
              className="flex flex-col flex-grow p-6 overflow-y-auto bg-gray-50"
              style={{ maxHeight: 'calc(100vh - 140px)' }}
            >
              <div className="flex flex-col space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'You' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex flex-col max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        msg.sender === 'You'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      {msg.sender !== 'You' && (
                        <span className="text-xs text-gray-500 mb-1 font-medium">
                          {msg.sender}
                        </span>
                      )}
                      <span className="text-sm leading-relaxed">
                        {msg.content}
                      </span>
                      <span
                        className={`text-xs mt-1 ${
                          msg.sender === 'You'
                            ? 'text-blue-100'
                            : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center p-4 bg-white border-t border-gray-200 shadow-lg">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-grow mr-3 py-3 px-4 rounded-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-md"
                disabled={!message.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </>
        ) : (
          /* Empty state - Centered content */
          <div className="flex flex-col items-center justify-center flex-grow bg-gray-50">
            <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-6 shadow-inner">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              All Message
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Select a conversation from the left to start messaging with
              students and instructors
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
