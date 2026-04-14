"use client";

import { useState, useEffect, useRef } from "react";
import { type SkinType, type AcneSeverity, acneRemedies } from "@/lib/data/acne-remedies";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

interface Expecting {
  type: "none" | "skinType" | "severity" | "reset";
  options?: string[];
}

export const ExpertChat = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [expecting, setExpecting] = useState<Expecting>({ type: "none" });
  const [userContext, setUserContext] = useState<{ skinType?: SkinType; severity?: AcneSeverity }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (text: string, nextExpectation?: Expecting, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "bot", text }]);
      setIsTyping(false);
      if (nextExpectation) {
        setExpecting(nextExpectation);
      }
    }, delay);
  };

  const startConversation = () => {
    setMessages([]);
    setUserContext({});
    addBotMessage(
      "Namaste! I am your Ayurvedic Skin Expert. To recommend the best natural remedy for your acne, what is your skin type?",
      { type: "skinType", options: ["Oily", "Dry", "Normal"] },
      1000
    );
  };

  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionSelect = (option: string) => {
    // Add user message
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "user", text: option }]);
    setExpecting({ type: "none" });

    if (expecting.type === "skinType") {
      setUserContext((prev) => ({ ...prev, skinType: option as SkinType }));
      addBotMessage(
        "Got it. And how would you describe your acne severity?",
        { type: "severity", options: ["Low", "Moderate", "Severe"] },
        1000
      );
    } else if (expecting.type === "severity") {
      const severity = option as AcneSeverity;
      const skinType = userContext.skinType!;
      
      // Compute recommendation
      addBotMessage("Analyzing ancient Ayurvedic remedies...", undefined, 800);
      
      setTimeout(() => {
        const matches = acneRemedies.filter(
          (r) => r.skinTypes.includes(skinType) && r.severities.includes(severity)
        );

        if (matches.length > 0) {
          // Pick a random match to keep it interesting if asked again
          const recommendation = matches[Math.floor(Math.random() * matches.length)];
          
          setIsTyping(true);
          setTimeout(() => {
             setMessages((prev) => [
               ...prev, 
               { id: Date.now().toString() + "_1", sender: "bot", text: `I have found a perfect natural remedy for your ${skinType.toLowerCase()} skin and ${severity.toLowerCase()} acne.` }
             ]);
             setTimeout(() => {
                setMessages((prev) => [
                  ...prev, 
                  { id: Date.now().toString() + "_2", sender: "bot", text: `🌿 **Ingredients**: ${recommendation.ingredients}\n\n🥣 **Preparation**: ${recommendation.preparationMethod}\n\n✨ **Benefits**: ${recommendation.benefits}` }
                ]);
                setIsTyping(false);
                setExpecting({ type: "reset", options: ["Ask again", "Close"] });
             }, 1500);
          }, 1000);
          
        } else {
          addBotMessage(
            "We couldn't find a specific match in our current dataset, but aloe vera and honey are great general balancers.",
            { type: "reset", options: ["Ask again", "Close"] },
            1000
          );
        }
      }, 2000);
    } else if (expecting.type === "reset") {
      if (option === "Close") {
        onClose();
      } else {
        startConversation();
      }
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full sm:w-[350px] bg-surface-container-lowest rounded-2xl shadow-2xl border border-primary/10 overflow-hidden font-body animate-in slide-in-from-bottom-8 duration-300">
      {/* Header */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary-fixed">eco</span>
          <div>
            <h3 className="font-headline font-bold text-sm">Ayurvedic Expert</h3>
            <p className="text-[10px] text-primary-fixed/80 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50 hide-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in zoom-in duration-300`}>
            {msg.sender === "bot" && (
              <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 mr-2 mt-auto">
                <span className="material-symbols-outlined text-[12px]">spa</span>
              </div>
            )}
            <div 
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                msg.sender === "user" 
                  ? "bg-primary text-white rounded-br-sm" 
                  : "bg-white text-on-surface-variant border border-outline-variant/15 shadow-sm rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 mr-2 mt-auto">
                <span className="material-symbols-outlined text-[12px]">spa</span>
              </div>
            <div className="bg-white border border-outline-variant/15 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Options Area */}
      <div className="p-4 bg-white border-t border-primary/5 shrink-0 min-h-[80px] flex items-center justify-center">
        {expecting.options && expecting.options.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {expecting.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className="px-4 py-2 bg-surface hover:bg-primary-fixed hover:text-on-primary-fixed text-primary text-xs font-bold rounded-full border border-primary/10 transition-colors shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant/50 italic text-center w-full">Expert is typing...</p>
        )}
      </div>
    </div>
  );
};
