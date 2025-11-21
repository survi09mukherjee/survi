import React, { useEffect, useState } from 'react';
import { useDoraTour } from './useDoraTour';
import { MultiplicationTutor } from './MultiplicationTutor';
import { Button } from "@/components/ui/button";
import { X, Minus, MessageCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const DORA_SECTIONS = [
    { id: 'hero', label: 'Welcome', description: 'Hi, I am your study buddy! Let me show you around.' },
    { id: 'about', label: 'About', description: 'Here you can learn more about me and my work.' },
    { id: 'dashboard', label: 'Dashboard', description: 'This is your personal dashboard.' },
    { id: 'lesson', label: 'Lesson', description: 'Ready to learn something new?' },
    { id: 'chat', label: 'Chat', description: 'Chat with AI friends here!' },
    { id: 'multiplication', label: 'Multiplication Zone', description: 'This is where we master multiplication together!' },
];

export const DoraGuideOverlay: React.FC = () => {
    const [tourState, tourActions] = useDoraTour();
    const [animationState, setAnimationState] = useState<'enter' | 'idle'>('enter');

    useEffect(() => {
        // Trigger enter animation on mount
        const timer = setTimeout(() => setAnimationState('idle'), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!tourState.isVisible) return null;

    const currentSection = DORA_SECTIONS.find(s => s.id === tourState.activeSectionId) || DORA_SECTIONS[0];
    const isMultiplication = tourState.activeSectionId === 'multiplication';

    return (
        <>
            {/* Character Overlay */}
            <div
                className={cn(
                    "fixed z-50 transition-all duration-1000 ease-out",
                    animationState === 'enter' ? "bottom-4 left-[-100px]" : "bottom-4 left-4",
                    "flex items-end gap-2"
                )}
            >
                {/* Character Avatar */}
                <div className="relative group">
                    {/* Speech Bubble */}
                    {!tourState.isMinimized && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border-2 border-blue-200 rounded-2xl p-3 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{currentSection.label}</span>
                                <div className="flex gap-1">
                                    <button onClick={tourActions.minimize} className="text-gray-400 hover:text-gray-600"><Minus className="w-3 h-3" /></button>
                                    <button onClick={tourActions.hide} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-snug">{currentSection.description}</p>

                            {isMultiplication && (
                                <Button
                                    size="sm"
                                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
                                    onClick={tourActions.openTutor}
                                >
                                    <BookOpen className="w-3 h-3 mr-2" />
                                    Teach me 📚
                                </Button>
                            )}

                            {/* Bubble Tail */}
                            <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-white border-b-2 border-r-2 border-blue-200 rotate-45"></div>
                        </div>
                    )}

                    {/* Avatar Image/Fallback */}
                    <div
                        className={cn(
                            "w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden bg-blue-100 cursor-pointer transition-transform hover:scale-105",
                            "animate-bounce-slow" // We'll need to ensure this animation exists or use inline style
                        )}
                        onClick={tourState.isMinimized ? tourActions.restore : undefined}
                        style={{ animation: 'bounce 3s infinite ease-in-out' }}
                    >
                        <img
                            src="/dora-guide.png"
                            alt="Dora Guide"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback if image missing
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl">🤖</span>';
                            }}
                        />
                    </div>

                    {/* Minimized Badge */}
                    {tourState.isMinimized && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                    )}
                </div>
            </div>

            {/* Multiplication Tutor Modal */}
            <MultiplicationTutor
                isOpen={tourState.isTutorOpen}
                onClose={tourActions.closeTutor}
            />

            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
        </>
    );
};
