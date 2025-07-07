import React from 'react';
import { X, Phone, Video, MoreVertical, Circle, Bot } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChartStore } from '../store/useChartStore';

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChartStore();
  const { onlineUsers, authUser } = useAuthStore();
  
  if (!selectedUser) return null;

  const isAI = selectedUser.isAI;
  const isOnline = isAI ? true : selectedUser.isOnline;
  
  return (
    <div className="px-4 py-3 border-b border-base-200 bg-base-100/95 backdrop-blur-sm sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between">
        {/* User info section */}
        <div className="flex items-center gap-3 group">
          {/* Avatar with online indicator */}
          <div className="avatar relative">
            <div className="w-12 h-12 rounded-full ring-2 ring-base-200 transition-all duration-300 group-hover:ring-primary/20">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-base-200 flex items-center justify-center">
                  {isAI ? (
                    <Bot size={24} className="text-primary" />
                  ) : (
                    <img 
                      src={selectedUser.profilepic || "/avatar.png"} 
                      alt={selectedUser.fullName}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className={`
                  absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-base-100
                  ${isOnline ? 'bg-success' : 'bg-base-300'}
                `} />
              </div>
            </div>
          </div>
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base-content">{selectedUser.fullName}</h3>
              {isOnline && (
                <div className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-[10px] text-green-700 dark:text-green-400 font-medium">
                  Active now
                </div>
              )}
            </div>
            <p className="text-xs text-base-content/60 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span>Online</span>
                </>
              ) : (
                <>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-base-content/30"></span>
                  <span>Offline</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {!isAI && (
            <button className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors">
              <Phone size={18} />
            </button>
          )}
          
          {!isAI && (
            <button className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors">
              <Video size={18} />
            </button>
          )}
          
          <button className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-primary hover:bg-primary/10 transition-colors">
            <MoreVertical size={18} />
          </button>
          
          <button 
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;