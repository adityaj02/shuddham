"use client";

import { useState } from "react";
import { ExpertChat } from "@/components/shared/expert-chat";

export const ConsultFab = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4">
          <ExpertChat onClose={() => setIsOpen(false)} />
        </div>
      )}

      <div className="group relative flex items-center">
        {!isOpen && (
          <div className="absolute right-full mr-4 px-4 py-2 bg-surface-container-lowest/80 backdrop-blur-md rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-xs font-label text-primary whitespace-nowrap">Ask an Ayurvedic Expert</p>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-primary text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 ${isOpen ? "rotate-90 scale-90 bg-error" : ""}`}
        >
          <span className="material-symbols-outlined">{isOpen ? "close" : "forum"}</span>
        </button>
      </div>
    </div>
  );
};
