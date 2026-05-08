"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { generateAIResponse } from "@/features/ai/aiThunk"
import { clearChat } from "@/features/ai/aiSlice"
import ReactMarkdown from 'react-markdown'


interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { messages, loading } = useAppSelector((state) => state.ai)
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch();
  const { me } = useAppSelector((state) => state.user)

  // Sync typing state with Redux loading state
  React.useEffect(() => {
    setIsTyping(loading)
  }, [loading])

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput("");

    try {
      await dispatch(generateAIResponse({
        messages,
        userMessage
      })).unwrap();
    } catch (error) {
      console.error("AI Error:", error);
    }
  };

  const handleClear = () => {
    dispatch(clearChat())
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-[380px] max-w-[calc(100vw-2rem)]"
          >
            <Card className="border-none p-0 shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl rounded-[2rem]">
              <CardHeader className="bg-primary p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                  <Sparkles size={100} />
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black tracking-tight leading-none mb-1">Nexus AI</CardTitle>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Always active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      title="Clear chat"
                      className="text-white hover:bg-white/20 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-white/20 rounded-xl"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-[450px]">
                {/* Messages Area */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex w-full gap-3",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border",
                        msg.role === "user"
                          ? "bg-secondary/10 border-secondary/20 text-secondary"
                          : "bg-primary/10 border-primary/20 text-primary"
                      )}>
                        {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={cn(
                        "flex flex-col gap-1 max-w-[80%]",
                        msg.role === "user" ? "items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm",
                          msg.role === "user"
                            ? "bg-secondary text-white rounded-tr-none"
                            : "bg-gray-50 text-[#1a1a3b] border border-gray-100 rounded-tl-none"
                        )}>
                          {msg.role === "assistant" ? (
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-black text-primary">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                code: ({ children }) => <code className="bg-primary/10 px-1 rounded text-primary font-bold">{children}</code>
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Bot size={14} />
                      </div>
                      <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-50 bg-white/50 backdrop-blur-sm">
                  <div className="relative group">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask anything about StudentNexus..."
                      className="h-12 pr-14 bg-gray-50/50 border-gray-100 rounded-2xl focus:bg-white focus:ring-primary/20 transition-all text-xs font-bold placeholder:text-gray-400 shadow-inner"
                    />
                    <Button
                      size="icon"
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all group-hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden relative group",
          isOpen ? "bg-rose-500 rotate-90" : "bg-primary"
        )}
      >
        <div className="absolute top-4 left-0 inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        {isOpen ? (
          <X className="text-white w-7 h-7 relative z-10" />
        ) : (
          <Bot className="text-white w-7 h-7 relative z-10" />
        )}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-0 right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </div>
  )
}
