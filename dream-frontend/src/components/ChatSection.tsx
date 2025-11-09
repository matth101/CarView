import { motion } from 'framer-motion';
import { Send, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatSectionProps {
  onBuildPreferences: (conversation: [number, string][]) => void;
}

const ChatSection = ({ onBuildPreferences }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your Toyota assistant. I can help you find the perfect vehicle based on your lifestyle and needs.",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "That's helpful! Based on what you've told me, I'd recommend looking at fuel-efficient options like the Camry Hybrid or Corolla Hybrid. Would you like to see these in your results?",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  const handleBuildPreferences = async () => {
	setIsBuilding(true);
	
	// Convert messages to tuple format: 0 = user, 1 = assistant
	const conversation: [number, string][] = messages.map(msg => [
	  msg.isUser ? 0 : 1,
	  msg.text
	]);
  
	console.log('💬 Chat conversation being sent:', conversation);
  
	// Simulate API delay
	setTimeout(() => {
	  onBuildPreferences(conversation);
	  setIsBuilding(false);
	}, 500);
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-1/3 bg-gray-50 border-l border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-toyota-red" size={20} />
          <h3 className="font-black text-lg">AI Assistant</h3>
        </div>
        <p className="text-sm text-gray-500">
          Ask me anything about Toyota vehicles
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                message.isUser
                  ? 'bg-toyota-red text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Build Preferences Button */}
      {messages.length > 2 && (
        <div className="px-6 pb-4">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuildPreferences}
            disabled={isBuilding}
            className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Wand2 size={18} />
            {isBuilding ? 'Building...' : 'Build User Preferences'}
          </motion.button>
        </div>
      )}

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-toyota-red transition-colors"
          />
          <button
            onClick={sendMessage}
            className="bg-toyota-red text-white p-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSection;