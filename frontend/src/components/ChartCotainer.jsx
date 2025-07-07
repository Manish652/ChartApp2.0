import React, { useEffect, useRef, useState } from 'react'
import { useChartStore } from "../store/useChartStore"
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './skeletons/MessageSkeleton'
import NoChartSelected from './NoChartSelected'
import { format, isSameDay, isValid } from 'date-fns'
import { Bot, ChevronLeft } from 'lucide-react'
import { GoogleGenerativeAI } from "@google/generative-ai";

function ChartCotainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeToMessages, sendMessage } = useChartStore()
  const { authUser } = useAuthStore()
  const { fontSize } = useThemeStore()
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const [isAILoading, setIsAILoading] = useState(false)
  const modelRef = useRef(null)
  const [fullscreenImage, setFullscreenImage] = useState(null)

  useEffect(() => {
    const genAI = new GoogleGenerativeAI("AIzaSyD9t4Sz5zopR_PUUvoXzNVpvet1PjhMHDA");
    modelRef.current = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 1,
        maxOutputTokens: 2048,
      },
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessages();

    return () => {
      unsubscribeToMessages();
    }
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeToMessages]);

  const handleAIMessage = async (message) => {
    if (!selectedUser?.isAI) return;
    
    try {
      const userMessage = {
        _id: Date.now().toString(),
        text: message.text,
        senderId: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilepic: authUser.profilepic
        },
        createdAt: new Date().toISOString()
      };
      
      await sendMessage(userMessage);
      setIsAILoading(true);

      // Generate AI response
      const prompt = message.text;
      console.log("Sending prompt to AI:", prompt);
      
      try {
        const chat = modelRef.current.startChat();
        const result = await chat.sendMessage(prompt);
        console.log("Got AI result:", result);
        
        const text = result.response.text();
        console.log("AI response text:", text);
        
        if (!text) {
          throw new Error("Empty response from AI");
        }
        
        // Send AI response
        const aiResponse = {
          _id: (Date.now() + 1).toString(),
          text: text,
          senderId: {
            _id: 'ai-assistant',
            fullName: 'AI Assistant',
            profilepic: null
          },
          createdAt: new Date().toISOString()
        };
        
        await sendMessage(aiResponse);
      } catch (aiError) {
        console.error('AI Generation Error:', aiError);
        throw new Error(aiError.message || "Failed to generate AI response");
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      const errorMessage = error.message || "There was an error processing your request.";
      const errorResponse = {
        _id: (Date.now() + 1).toString(),
        text: `I apologize, but ${errorMessage} Please try again.`,
        senderId: {
          _id: 'ai-assistant',
          fullName: 'AI Assistant',
          profilepic: null
        },
        createdAt: new Date().toISOString()
      };
      await sendMessage(errorResponse);
    } finally {
      setIsAILoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (!isValid(date)) return '';
      return format(date, 'HH:mm');
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (!isValid(date)) return '';
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const isMessageFromAuthUser = message => {
    if (!message?.senderId || !authUser?._id) return false;
    return message.senderId._id === authUser._id;
  };

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-hidden bg-base-100'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  if (!selectedUser) {
    return <NoChartSelected />;
  }

  // Return null if AI is selected (handled by Sidebar)
  if (selectedUser.isAI) {
    return null;
  }

  return (
    <div className='flex-1 flex flex-col overflow-hidden bg-base-100 relative'>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTI0IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>
      
      {/* Mobile Back Button */}
      <div className="lg:hidden absolute top-4 left-4 z-10">
        <button 
          onClick={() => window.history.back()}
          className="btn btn-circle btn-ghost btn-sm"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      <ChatHeader />
      
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className='flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4 scroll-smooth relative z-10'
      >
        {messages?.map((message, index) => {
          if (!message) return null;
          
          const isFirstMessage = index === 0 || 
            !isSameDay(
              new Date(messages[index - 1]?.createdAt || new Date()), 
              new Date(message?.createdAt || new Date())
            );
          
          return (
            <React.Fragment key={message._id || index}>
              {/* Date Separator */}
              {isFirstMessage && (
                <div className="flex items-center justify-center my-2 sm:my-4 animate-fade-in">
                  <div className="px-2 py-0.5 text-xs text-base-content/50 bg-base-200 rounded-full">
                    {formatDate(message?.createdAt)}
                  </div>
                </div>
              )}

              {/* Message */}
              <div 
                className={`flex ${isMessageFromAuthUser(message) ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`max-w-[90%] sm:max-w-[70%] space-y-0.5`}>
                  {/* Message Content */}
                  <div className={`
                    rounded-2xl px-3 py-1.5
                    ${isMessageFromAuthUser(message) 
                      ? 'bg-primary text-primary-content rounded-br-none' 
                      : 'bg-base-200 rounded-bl-none'
                    }
                    transition-all duration-200
                    hover:shadow-md
                  `}>
                    {message.text && (
                      <p 
                        className="text-sm sm:text-base break-words"
                        style={{ fontSize: `${Math.min(Math.max(parseInt(fontSize), 12), 24)}px` }}
                      >
                        {message.text}
                      </p>
                    )}
                    {message.image && (
                      <div className="mt-1">
                        <img 
                          src={message.image} 
                          alt="Message attachment" 
                          className="max-w-[200px] sm:max-w-[300px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setFullscreenImage(message.image)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div className={`text-[10px] sm:text-xs text-base-content/50 ${isMessageFromAuthUser(message) ? 'text-right' : 'text-left'}`}>
                    {formatTime(message?.createdAt)}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        {isAILoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[90%] sm:max-w-[70%] space-y-0.5">
              <div className="bg-base-200 rounded-2xl rounded-bl-none px-3 py-1.5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fullscreen Image View */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <img 
            src={fullscreenImage} 
            alt="Fullscreen view" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <MessageInput onSendMessage={selectedUser?.isAI ? handleAIMessage : undefined} />
    </div>
  );
}

export default ChartCotainer;
