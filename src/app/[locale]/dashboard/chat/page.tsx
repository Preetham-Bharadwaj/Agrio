"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mic, 
  Bot, 
  User, 
  ChevronLeft,
  Sparkles,
  RefreshCcw,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";

interface Message {
  role: 'bot' | 'user';
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Namaste! I am Sarkari Saathi. How can I help you today? You can ask me about Mandi rates, Govt schemes, or crop diseases." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("wheat") || lowerInput.includes("gehu") || lowerInput.includes("mandi")) {
        botResponse = "Current Wheat rates in Nashik Mandi: ₹2,450 - ₹2,600 per quintal. Prices are expected to rise by 5% next week. Suggestion: HOLD.";
      } else if (lowerInput.includes("scheme") || lowerInput.includes("sarkari") || lowerInput.includes("paisa")) {
        botResponse = "You are eligible for PM-Kisan Samman Nidhi. The next installment of ₹2,000 is due on April 15. Your Aadhaar is already linked.";
      } else if (lowerInput.includes("tomato") || lowerInput.includes("disease")) {
        botResponse = "Looking at Nashik trends, Early Blight is spreading. Use Copper Oxychloride 3g/L for spraying. Want me to order it for you?";
      } else {
        botResponse = "I am processing your request. As an AI Agri-expert, I suggest checking your local district pooling status for better collective bargaining.";
      }

      setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#faf6ee] max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="bg-primary p-6 rounded-b-[2rem] shadow-xl relative z-20">
        <div className="flex items-center justify-between text-background mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-background hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="font-serif font-bold text-xl">Sarkari Saathi</h1>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">AI Agri Assistant</p>
          </div>
          <Button variant="ghost" size="icon" className="text-background hover:bg-white/10">
            <RefreshCcw className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex justify-center gap-2">
          {['Hindi', 'Kannada', 'Marathi'].map(lang => (
            <span key={lang} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-background/60 border border-white/5">
              {lang}
            </span>
          ))}
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-primary text-background rounded-tr-none shadow-lg' 
                  : 'bg-white text-primary rounded-tl-none border border-muted shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-1 opacity-40">
                  {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {msg.role === 'user' ? 'You' : 'Saathi'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                {msg.role === 'bot' && (
                  <div className="mt-3 pt-3 border-t border-muted/50 flex gap-2">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] font-bold text-secondary hover:text-secondary hover:bg-secondary/5">
                      <Volume2 className="w-3 h-3 mr-1" /> HEAR IN HINDI
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-muted p-4 rounded-3xl rounded-tl-none flex gap-2">
                <div className="w-2 h-2 bg-primary/20 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-muted relative z-20">
        <div className="absolute inset-x-0 -top-8 flex justify-center pointer-events-none">
          <div className="bg-secondary text-primary px-4 py-1.5 rounded-full text-[10px] font-bold shadow-xl border border-secondary/20 flex items-center gap-2 pointer-events-auto cursor-pointer animate-bounce">
            <Sparkles className="w-3 h-3" />
            ASK ABOUT CROP SUBSIDY
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="icon" variant="outline" className="rounded-2xl border-muted h-14 w-14 shrink-0 hover:bg-primary/5 transition-colors">
            <Mic className="w-6 h-6 text-primary/40" />
          </Button>
          <div className="relative flex-1">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className="rounded-2xl border-muted py-7 pl-6 pr-14 bg-[#faf6ee]/50 focus-visible:ring-primary shadow-inner"
            />
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary hover:bg-primary/90 h-10 w-10 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
