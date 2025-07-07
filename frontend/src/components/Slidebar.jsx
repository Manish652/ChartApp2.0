import { useEffect, useState } from "react";
import { useChartStore } from "../store/useChartStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users, Search, Plus, Filter, MessageSquare, UserRound, Bot, Menu, Phone, Video, MoreVertical } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import GeminiChat from "./GeminiChat";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChartStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOnlineFilter = !showOnlineOnly || onlineUsers.includes(user._id);
    return matchesSearch && matchesOnlineFilter;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  // AI Assistant user object
  const aiAssistant = {
    _id: "ai-assistant",
    fullName: "AI Assistant",
    profilepic: null,
    isAI: true
  };

  // If AI is selected, show GeminiChat
  if (selectedUser?.isAI) {
    return <GeminiChat />;
  }

  return (
    <aside className={`h-full ${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-[400px] bg-base-200/95 backdrop-blur-md flex-col border-r border-base-content/5 transition-all duration-300 relative z-30`}>
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-4 bg-primary">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-primary-content">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-primary-content">echoLine</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-primary-content">
            <Search className="w-6 h-6" />
          </button>
          <button className="text-primary-content">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block p-4 bg-base-100/50 backdrop-blur-sm border-b border-base-content/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-lg"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary-content" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Chats
              </span>
              <span className="text-xs text-base-content/60">
                {onlineUsers.length} online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-base-content/5 text-base-content/70 transition-all duration-200">
              <Video className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-base-content/5 text-base-content/70 transition-all duration-200">
              <Phone className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-base-content/5 text-base-content/70 transition-all duration-200">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 group-focus-within:text-primary transition-colors duration-200" />
            <Input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-base-content/5 border-transparent focus:border-primary/20 focus:bg-base-content/10 transition-all duration-200 rounded-full"
            />
          </div>
          <div className="flex items-center gap-2 text-sm px-1">
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                showOnlineOnly
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-base-content/5 text-base-content/70"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Online ({onlineUsers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {/* AI Assistant Button */}
        <button
          onClick={() => navigate('/ai-chat')}
          className="w-full group border-b border-base-content/5"
        >
          <div className="flex items-center gap-4 p-4 transition-all duration-200 hover:bg-base-content/5">
            <div className="relative">
              <div className="avatar">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-lg"></div>
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Bot className="w-7 h-7 text-primary-content" />
                  </div>
                  {/* Glowing effect */}
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border border-secondary/30 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success shadow-lg border-2 border-base-200 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold truncate text-base-content group-hover:text-primary transition-colors">
                  AI Assistant
                </h3>
                <span className="text-xs text-base-content/50">Now</span>
              </div>
              <p className="text-sm text-base-content/70 truncate flex items-center gap-1">
                <span className="font-medium text-success">Always ready to help</span>
              </p>
            </div>
          </div>
        </button>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="w-full group border-b border-base-content/5 last:border-0"
            >
              <div className={`flex items-center gap-4 p-4 transition-all duration-200 ${
                selectedUser?._id === user._id
                  ? "bg-base-content/5"
                  : "hover:bg-base-content/5"
              }`}>
                <div className="relative">
                  <div className="avatar">
                    <div className={`w-14 h-14 rounded-full ring-2 ring-offset-base-200 ${
                      selectedUser?._id === user._id ? "ring-primary" : "ring-base-content/10"
                    }`}>
                      <img
                        src={user.profilepic || "/avatar.png"}
                        alt={user.fullName}
                        onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${user.fullName}`}
                        className="object-cover rounded-full"
                      />
                    </div>
                  </div>
                  {onlineUsers.includes(user._id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success shadow-lg border-2 border-base-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium truncate transition-colors ${
                      selectedUser?._id === user._id ? "text-primary" : "text-base-content group-hover:text-primary"
                    }`}>
                      {user.fullName}
                    </h3>
                    <span className="text-xs text-base-content/50">12:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-base-content/70 truncate">
                      {onlineUsers.includes(user._id) ? (
                        <span className="font-medium text-success">Online</span>
                      ) : (
                        <span>Last seen recently</span>
                      )}
                    </p>
                    {/* Removed the unread message badge that was here */}
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="h-60 flex flex-col items-center justify-center text-center p-6">
            <div className="relative w-20 h-20 mb-5">
              <div className="absolute inset-0 rounded-full bg-base-content/5 blur-lg"></div>
              <div className="relative w-full h-full rounded-full bg-base-content/5 flex items-center justify-center">
                <UserRound className="w-10 h-10 text-base-content/40" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-base-content">No chats found</h3>
            <p className="text-sm text-base-content/60 mt-2">
              {showOnlineOnly
                ? "No online contacts matching your search."
                : "Start a new conversation or try a different search."}
            </p>
          </div>
        )}
      </div>

      {/* Mobile New Chat Button */}
      <button 
        onClick={() => navigate('/ai-chat')}
        className="md:hidden fixed right-4 bottom-4 w-14 h-14 rounded-full bg-primary text-primary-content shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </aside>
  );
};

export default Sidebar;