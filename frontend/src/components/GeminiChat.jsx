import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, MessageSquare, Image, FileText, Mic, Trash, Info } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const messagesEndRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const genAI = new GoogleGenerativeAI("AIzaSyD9t4Sz5zopR_PUUvoXzNVpvet1PjhMHDA");
    modelRef.current = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !modelRef.current) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = modelRef.current.startChat({
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      for (const msg of messages) {
        if (msg.sender === 'user') {
          await chat.sendMessage(msg.text);
        }
      }

      const result = await chat.sendMessage(input);
      const response = result.response;
      const text = response.text();

      const botMessage = {
        id: messages.length + 2,
        text: text || "Sorry, I couldn't generate a response.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: `Error: ${error.message || "There was an error processing your request."}`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const userMessage = {
          id: messages.length + 1,
          text: file.name,
          sender: 'user',
          timestamp: new Date(),
          type: 'image',
          file: e.target.result
        };
        setMessages(prev => [...prev, userMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "👋 Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  return (
    <div className="h-screen bg-base-100">
      <div className="flex h-full max-w-screen-xl mx-auto">
        {/* Sidebar - Minimal Version */}
        <div className="w-20 lg:w-64 border-r border-base-200 hidden lg:flex flex-col">
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Bot className="text-primary-content" size={20} />
              </div>
              <h2 className="font-bold text-lg hidden lg:block">AI Chat</h2>
            </div>
            
            <div className="space-y-2">
              <button className="btn btn-ghost justify-center lg:justify-start w-full gap-3 normal-case">
                <MessageSquare size={18} />
                <span className="hidden lg:inline">New Chat</span>
              </button>
              <button onClick={clearChat} className="btn btn-ghost justify-center lg:justify-start w-full gap-3 normal-case">
                <Trash size={18} />
                <span className="hidden lg:inline">Clear Chat</span>
              </button>
            </div>
            
            <div className="mt-auto">
              <div className="bg-base-200 rounded-xl p-3">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs">
                  <Info size={12} className="text-primary" />
                  <span className="hidden lg:inline">Powered by Gemini AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg mx-auto text-center space-y-6 py-12"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">
                  How can I help you today?
                </h1>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  <button className="btn btn-ghost btn-sm normal-case">Write a story</button>
                  <button className="btn btn-ghost btn-sm normal-case">Help with code</button>
                  <button className="btn btn-ghost btn-sm normal-case">Answer questions</button>
                  <button className="btn btn-ghost btn-sm normal-case">Generate ideas</button>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.sender === 'bot' 
                        ? 'bg-primary' 
                        : 'bg-secondary'
                    }`}>
                      {message.sender === 'bot' ? (
                        <Bot size={14} className="text-primary-content" />
                      ) : (
                        <User size={14} className="text-secondary-content" />
                      )}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-secondary text-secondary-content'
                        : 'bg-base-200'
                    }`}>
                      {message.type === 'image' ? (
                        <img src={message.file} alt={message.text} className="rounded-lg max-w-sm" />
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          {message.text}
                        </div>
                      )}
                      <div className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Bot size={14} className="text-primary-content" />
                  </div>
                  <div className="bg-base-200 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-base-200 p-3">
            <div className="max-w-3xl mx-auto relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message AI assistant..."
                rows={1}
                className="textarea textarea-bordered w-full pr-12 resize-none min-h-[2.5rem] bg-base-100/50 focus:outline-none focus:border-primary/30"
              />
              
              <div className="absolute right-2 bottom-2 flex gap-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="p-1 rounded-full hover:bg-base-200"
                >
                  <Image size={16} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className={`p-1 rounded-full ${input.trim() ? 'text-primary' : 'text-base-content/30'}`}
                >
                  <Send size={16} />
                </motion.button>
              </div>

              <AnimatePresence>
                {showAttachments && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute bottom-full right-0 mb-2 w-40 rounded-lg shadow-lg bg-base-100 border border-base-200"
                  >
                    <div className="p-1">
                      <label className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md w-full cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Image size={14} />
                        <span className="text-sm">Image</span>
                      </label>
                      <button className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md w-full">
                        <FileText size={14} />
                        <span className="text-sm">File</span>
                      </button>
                      <button className="flex items-center gap-2 p-2 hover:bg-base-200 rounded-md w-full">
                        <Mic size={14} />
                        <span className="text-sm">Voice</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-xs text-center mt-2 text-base-content/40">
              AI may provide inaccurate information
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;