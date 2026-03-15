"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  User,
  Package,
  CreditCard,
  Truck,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const quickChips = [
  "Track Order",
  "Payment Issues", 
  "Return Request",
  "Account Help",
  "Delivery Problems",
  "Product Quality",
  "Refund Status",
  "Contact Farmer"
];

const faqCategories = [
  {
    icon: Package,
    title: "Orders & Shopping",
    questions: [
      "How do I place an order?",
      "Can I modify my order after placing it?",
      "How do I track my delivery?",
      "What if I receive wrong items?"
    ]
  },
  {
    icon: CreditCard,
    title: "Payment & Billing",
    questions: [
      "What payment methods are accepted?",
      "Is COD available?",
      "How do I get a refund?",
      "Why was my payment declined?"
    ]
  },
  {
    icon: Truck,
    title: "Delivery & Shipping",
    questions: [
      "What are the delivery charges?",
      "How long does delivery take?",
      "Can I schedule delivery?",
      "What if I'm not available during delivery?"
    ]
  },
  {
    icon: User,
    title: "Account & Profile",
    questions: [
      "How do I update my profile?",
      "Can I change my delivery address?",
      "How do I reset my password?",
      "How do I delete my account?"
    ]
  }
];

export default function SupportPage() {
  const { locale } = useParams();
  const [selectedChip, setSelectedChip] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message: "Hi! I'm here to help you. How can I assist you today?"
    }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { type: "user", message: chatMessage }
      ]);
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { 
            type: "bot", 
            message: "Thank you for your message. Our support team will get back to you shortly. Is there anything else I can help you with?" 
          }
        ]);
      }, 1000);
      
      setChatMessage("");
    }
  };

  const handleChipClick = (chip: string) => {
    setSelectedChip(chip);
    setChatMessages([
      ...chatMessages,
      { type: "user", message: chip }
    ]);
    
    // Simulate bot response based on chip
    setTimeout(() => {
      let response = "";
      switch (chip) {
        case "Track Order":
          response = "To track your order, please go to the Orders section in your dashboard. You can see real-time updates there. Do you have your order ID?";
          break;
        case "Payment Issues":
          response = "I understand you're having payment issues. Can you tell me more about the problem? Is it related to a specific order?";
          break;
        case "Return Request":
          response = "For return requests, please visit your Orders page and click on the specific order. You'll find the return option there. What would you like to return?";
          break;
        default:
          response = "I understand you need help with " + chip + ". Can you provide more details about your issue?";
      }
      
      setChatMessages(prev => [
        ...prev,
        { type: "bot", message: response }
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-primary mb-2">
            💬 Help
          </h1>
          <p className="text-foreground/60">
            Quick chips • Chatbot support • Call / email / WhatsApp options
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Support Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Chips */}
          <Card className="bg-white border-muted p-6">
            <h2 className="text-xl font-serif text-primary mb-4">Quick Help</h2>
            <div className="flex flex-wrap gap-2">
              {quickChips.map((chip, index) => (
                <motion.div
                  key={chip}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant={selectedChip === chip ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleChipClick(chip)}
                    className="rounded-full"
                  >
                    {chip}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Chatbot Support */}
          <Card className="bg-white border-muted">
            <div className="p-6 border-b border-muted">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-primary">Chat Support</h2>
                  <p className="text-sm text-foreground/60">Usually responds instantly</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Online</Badge>
              </div>
            </div>
            
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-6 border-t border-muted">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-muted rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button
                  onClick={handleSendMessage}
                  className="rounded-full px-6"
                  disabled={!chatMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* FAQ Categories */}
          <div>
            <h2 className="text-xl font-serif text-primary mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white border-muted p-6 hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-primary">{category.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {category.questions.map((question, qIndex) => (
                        <div key={qIndex} className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60">{question}</span>
                          <ChevronRight className="w-4 h-4 text-foreground/30" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Options Sidebar */}
        <div className="space-y-6">
          {/* Contact Options */}
          <Card className="bg-white border-muted p-6">
            <h2 className="text-xl font-serif text-primary mb-4">Contact Us</h2>
            <div className="space-y-4">
              <div className="p-4 border border-muted rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Phone Support</span>
                </div>
                <p className="text-sm text-foreground/60 mb-3">
                  +91 8000-123-456
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <Clock className="w-3 h-3" />
                  <span>Mon-Sat, 9AM-9PM</span>
                </div>
                <Button className="w-full mt-3 rounded-full">
                  Call Now
                </Button>
              </div>

              <div className="p-4 border border-muted rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Email Support</span>
                </div>
                <p className="text-sm text-foreground/60 mb-3">
                  support@agrio.com
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <Clock className="w-3 h-3" />
                  <span>Response within 24 hours</span>
                </div>
                <Button variant="outline" className="w-full mt-3 rounded-full">
                  Send Email
                </Button>
              </div>

              <div className="p-4 border border-muted rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">WhatsApp</span>
                </div>
                <p className="text-sm text-foreground/60 mb-3">
                  +91 8000-123-456
                </p>
                <div className="flex items-center gap-2 text-xs text-foreground/40">
                  <Clock className="w-3 h-3" />
                  <span>Instant replies</span>
                </div>
                <Button variant="outline" className="w-full mt-3 rounded-full">
                  Chat on WhatsApp
                </Button>
              </div>
            </div>
          </Card>

          {/* Emergency Support */}
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Emergency Support</h3>
            </div>
            <p className="text-sm text-red-700 mb-4">
              For urgent issues with orders, payments, or account security
            </p>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Hotline
            </Button>
          </Card>

          {/* Help Resources */}
          <Card className="bg-white border-muted p-6">
            <h3 className="font-semibold text-primary mb-4">Help Resources</h3>
            <div className="space-y-3">
              <Link href="#" className="flex items-center justify-between text-sm text-foreground/60 hover:text-primary">
                <span>User Guide</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-between text-sm text-foreground/60 hover:text-primary">
                <span>Video Tutorials</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-between text-sm text-foreground/60 hover:text-primary">
                <span>Terms & Conditions</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="#" className="flex items-center justify-between text-sm text-foreground/60 hover:text-primary">
                <span>Privacy Policy</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
