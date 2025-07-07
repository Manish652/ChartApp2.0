import { MessageSquare, Users, Bot, Shield } from "lucide-react";

const NoChartSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div className="max-w-2xl w-full p-8">
        <div className="text-center space-y-8">
          {/* Logo and Welcome */}
          <div className="space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary to-secondary opacity-20 blur-xl animate-pulse"></div>
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-primary-content" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to echoLine!
            </h1>
            <p className="text-base-content/70 text-lg">
              Connect, chat, and collaborate in real-time
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-content/10 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">Real-time Chat</h3>
              <p className="text-base-content/70">
                Connect with friends and colleagues instantly with our real-time messaging system
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-content/10 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">AI Assistant</h3>
              <p className="text-base-content/70">
                Get instant help with our advanced AI assistant powered by cutting-edge technology
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-content/10 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">Secure Messaging</h3>
              <p className="text-base-content/70">
                Your messages are end-to-end encrypted for maximum privacy and security
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-content/10 hover:border-primary/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-2">Rich Messaging</h3>
              <p className="text-base-content/70">
                Share images, emojis, and files seamlessly in your conversations
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="btn btn-primary">
              <Users className="w-4 h-4" />
              Select Contact
            </button>
            <button className="btn btn-secondary">
              <Bot className="w-4 h-4" />
              Start AI Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChartSelected;