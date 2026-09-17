import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function TalkToLumi() {
  const [sessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [extractedData, setExtractedData] = useState({ name: null, age: null, location: null, email: null, grievance: null });
  const [isComplete, setIsComplete] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, error]);
  
  useEffect(() => {
    let timeout;
    if (messages.length === 0) {
      setIsTyping(true);
      timeout = setTimeout(() => {
        setMessages([{ sender: 'lumi', text: "Hey... I'm Lumi. ✨\nYou don't have to figure everything out alone. I'm here to listen.\nBefore we begin, what should I call you?" }]);
        setIsTyping(false);
      }, 1500);
    }
    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  const handleSend = async () => {
    if (isTyping || !inputValue.trim()) return;
    
    setError('');
    const userText = inputValue.trim();
    
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: userText })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'lumi', text: data.response }]);
      if (data.extractedData) {
        setExtractedData(data.extractedData);
      }
      if (data.isComplete) {
        setIsComplete(true);
      }
      
    } catch (err) {
      console.error(err);
      setError("I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (step === 4 && e.shiftKey) {
        return;
      }
      if (step !== 4) {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const fieldsCollected = Object.values(extractedData).filter(v => v !== null && v !== '').length;
  const step = Math.min(fieldsCollected, 4);

  return (
    <div 
      className="min-h-screen bg-[#060B19] text-lumi-cream font-sans relative overflow-hidden flex flex-col"
      style={{
        backgroundImage: "url('/talk-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#060B19]/30" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#060B19_100%)] opacity-60" />
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 z-10 relative h-full">
        
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center h-[25vh] md:h-auto mt-4 md:mt-0">
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative flex items-center justify-center"
          >
            <div className={`absolute rounded-full transition-all duration-1000 blur-2xl ${isTyping ? 'w-48 h-48 bg-lumi-yellow/30' : 'w-32 h-32 bg-lumi-yellow/10'}`} />
            <img src="/lumi-spark.png" alt="Lumi" className="h-[20vh] md:h-[40vh] w-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(255,193,7,0.3)]" />
            <div className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 z-20 mix-blend-screen ${isTyping ? 'w-24 h-24 bg-[radial-gradient(circle,rgba(255,255,255,0.6)_0%,transparent_70%)] animate-pulse' : 'w-12 h-12 bg-[radial-gradient(circle,rgba(255,193,7,0.4)_0%,transparent_70%)]'}`} />
          </motion.div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col h-[55vh] md:h-[65vh] bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'lumi' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                    msg.sender === 'lumi' 
                      ? 'bg-[#1a2b4c]/80 border border-lumi-yellow/30 text-lumi-cream shadow-[0_0_15px_rgba(255,193,7,0.1)] rounded-tl-sm' 
                      : 'bg-lumi-yellow/90 text-lumi-midnight rounded-tr-sm shadow-md font-medium'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1a2b4c]/50 border border-white/10 text-lumi-cream rounded-2xl rounded-tl-sm px-5 py-4 flex items-center space-x-1">
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-lumi-yellow rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-lumi-yellow rounded-full" />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-lumi-yellow rounded-full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 md:p-6 bg-[#060B19]/80 border-t border-white/10">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-lumi-yellow text-xs md:text-sm mb-3 px-2">
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isComplete ? (
              <div className="relative flex items-end gap-2">
                {step === 4 ? (
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Share what's on your mind..."
                    disabled={isTyping}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-lumi-cream placeholder:text-white/30 focus:outline-none focus:border-lumi-yellow/50 focus:ring-1 focus:ring-lumi-yellow/50 transition-colors resize-none h-24 scrollbar-thin"
                  />
                ) : (
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your response..."
                    disabled={isTyping}
                    className="w-full bg-white/5 border border-white/20 rounded-full px-5 py-3 text-lumi-cream placeholder:text-white/30 focus:outline-none focus:border-lumi-yellow/50 focus:ring-1 focus:ring-lumi-yellow/50 transition-colors"
                  />
                )}
                
                <button
                  onClick={handleSend}
                  disabled={isTyping || !inputValue.trim()}
                  className={`flex-shrink-0 p-3 rounded-full flex items-center justify-center transition-all ${
                    !inputValue.trim() || isTyping 
                      ? 'bg-white/10 text-white/30 cursor-not-allowed' 
                      : 'bg-lumi-yellow hover:bg-lumi-yellow-hover text-lumi-midnight shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-3 text-white/50 text-sm">
                Conversation Complete
              </div>
            )}
            
            {!isComplete && (
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-4 bg-lumi-yellow' : i < step ? 'w-1 bg-lumi-yellow/50' : 'w-1 bg-white/10'}`} />
                ))}
              </div>
            )}
          </div>
        </div>
        
      </main>
    </div>
  );
}
