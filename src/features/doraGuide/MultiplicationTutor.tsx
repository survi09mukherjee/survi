import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, ArrowRight, RefreshCw, Star } from "lucide-react";

interface MultiplicationTutorProps {
    isOpen: boolean;
    onClose: () => void;
}

const LEVELS = [
    { id: 1, title: "Level 1: Basics", description: "What is multiplication?" },
    { id: 2, title: "Level 2: Groups & Arrays", description: "Visualizing multiplication" },
    { id: 3, title: "Level 3: Times Tables", description: "Practice your tables" },
    { id: 4, title: "Level 4: Multi-Digit", description: "Step-by-step algorithms" },
    { id: 5, title: "Level 5: Tricks & Advanced", description: "Mental math magic" },
];

export const MultiplicationTutor: React.FC<MultiplicationTutorProps> = ({ isOpen, onClose }) => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [step, setStep] = useState(0); // 0: Intro, 1: Example, 2: Practice/Quiz
    const [quizAnswer, setQuizAnswer] = useState("");
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);

    const handleNextLevel = () => {
        if (currentLevel < 5) {
            if (!completedLevels.includes(currentLevel)) {
                setCompletedLevels([...completedLevels, currentLevel]);
            }
            setCurrentLevel(prev => prev + 1);
            setStep(0);
            setFeedback({ type: null, message: "" });
            setQuizAnswer("");
        } else {
            // Finished all levels
            setFeedback({ type: 'success', message: "You are a Multiplication Master! 🎉" });
        }
    };

    const handleCheckAnswer = (correctAnswer: string | number) => {
        if (quizAnswer.trim() === String(correctAnswer)) {
            setFeedback({ type: 'success', message: "Correct! Great job! 🌟" });
        } else {
            setFeedback({ type: 'error', message: "Not quite. Try again! 💪" });
        }
    };

    const renderLevelContent = () => {
        switch (currentLevel) {
            case 1: // Basics
                return (
                    <div className="space-y-4">
                        {step === 0 && (
                            <div className="text-center space-y-4">
                                <p className="text-lg">Multiplication is just <strong>repeated addition</strong>.</p>
                                <div className="p-4 bg-secondary/20 rounded-lg">
                                    <p className="text-2xl font-bold mb-2">3 × 4</p>
                                    <p>means "3 groups of 4"</p>
                                    <p className="mt-2 text-xl">4 + 4 + 4 = 12</p>
                                </div>
                                <Button onClick={() => setStep(1)}>See Visual Example <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </div>
                        )}
                        {step === 1 && (
                            <div className="text-center space-y-4">
                                <p>Here are 3 groups of 4 dots:</p>
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3].map(g => (
                                        <div key={g} className="grid grid-cols-2 gap-1 p-2 border rounded-md">
                                            {[1, 2, 3, 4].map(d => <div key={d} className="w-3 h-3 bg-primary rounded-full" />)}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xl font-bold">Total: 12 dots</p>
                                <Button onClick={() => setStep(2)}>Try it Yourself <ArrowRight className="ml-2 h-4 w-4" /></Button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-4">
                                <p className="text-center">What is 2 × 3? (2 groups of 3)</p>
                                <div className="flex justify-center gap-4 mb-4">
                                    {[1, 2].map(g => (
                                        <div key={g} className="flex gap-1 p-2 border rounded-md">
                                            {[1, 2, 3].map(d => <div key={d} className="w-3 h-3 bg-blue-500 rounded-full" />)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Input
                                        type="number"
                                        value={quizAnswer}
                                        onChange={(e) => setQuizAnswer(e.target.value)}
                                        className="w-20 text-center"
                                        placeholder="?"
                                    />
                                    <Button onClick={() => handleCheckAnswer(6)}>Check</Button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2: // Arrays
                return (
                    <div className="space-y-4">
                        {step === 0 && (
                            <div className="text-center space-y-4">
                                <p>We can also show multiplication as an <strong>Array</strong> (rows and columns).</p>
                                <div className="p-4 bg-secondary/20 rounded-lg inline-block">
                                    <div className="grid grid-cols-5 gap-2">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <div key={i} className="w-4 h-4 bg-primary rounded-sm" />
                                        ))}
                                    </div>
                                    <p className="mt-2">2 Rows × 5 Columns = 10</p>
                                </div>
                                <div className="block mt-4">
                                    <Button onClick={() => setStep(1)}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                </div>
                            </div>
                        )}
                        {step === 1 && (
                            <div className="space-y-4 text-center">
                                <p>How many dots?</p>
                                <div className="inline-block p-2 border rounded-lg">
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <div key={i} className="w-4 h-4 bg-green-500 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">4 Rows × 3 Columns</p>
                                <div className="flex gap-2 justify-center mt-4">
                                    <Input
                                        type="number"
                                        value={quizAnswer}
                                        onChange={(e) => setQuizAnswer(e.target.value)}
                                        className="w-20 text-center"
                                        placeholder="?"
                                    />
                                    <Button onClick={() => handleCheckAnswer(12)}>Check</Button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 3: // Times Tables
                return (
                    <div className="space-y-4 text-center">
                        {step === 0 && (
                            <>
                                <p>Pick a number to practice!</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <Button key={num} variant="outline" onClick={() => { setQuizAnswer(""); setStep(1); }}>{num}</Button>
                                    ))}
                                </div>
                            </>
                        )}
                        {step === 1 && (
                            <div className="space-y-4">
                                <p>Quick Quiz: What is 7 × 8?</p>
                                <div className="flex gap-2 justify-center">
                                    <Input
                                        type="number"
                                        value={quizAnswer}
                                        onChange={(e) => setQuizAnswer(e.target.value)}
                                        className="w-20 text-center"
                                    />
                                    <Button onClick={() => handleCheckAnswer(56)}>Check</Button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 4: // Multi-Digit
                return (
                    <div className="space-y-4">
                        <p className="text-center">Let's break down <strong>14 × 3</strong></p>
                        <div className="p-4 bg-secondary/10 rounded-lg space-y-2 font-mono text-lg text-center">
                            <p>14 is (10 + 4)</p>
                            <p>So: (10 × 3) + (4 × 3)</p>
                            <p>= 30 + 12</p>
                            <p className="font-bold text-primary">= 42</p>
                        </div>
                        <div className="flex gap-2 justify-center mt-4">
                            <p className="self-center">Try: 12 × 4 = </p>
                            <Input
                                type="number"
                                value={quizAnswer}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="w-20 text-center"
                            />
                            <Button onClick={() => handleCheckAnswer(48)}>Check</Button>
                        </div>
                    </div>
                );

            case 5: // Tricks
                return (
                    <div className="space-y-4 text-center">
                        <p className="font-semibold">The 9s Trick</p>
                        <p>To multiply by 9, hold up 10 fingers.</p>
                        <p>Put down the finger of the number you are multiplying.</p>
                        <p className="text-sm text-muted-foreground">(e.g. for 9×3, put down 3rd finger)</p>
                        <div className="flex justify-center gap-1 my-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className={`w-4 h-12 rounded-full ${i === 2 ? 'bg-gray-300 mt-4' : 'bg-orange-300'}`}></div>
                            ))}
                        </div>
                        <p>2 fingers on left (20) + 7 fingers on right (7) = 27!</p>
                        <div className="flex gap-2 justify-center mt-4">
                            <p className="self-center">Try: 9 × 5 = </p>
                            <Input
                                type="number"
                                value={quizAnswer}
                                onChange={(e) => setQuizAnswer(e.target.value)}
                                className="w-20 text-center"
                            />
                            <Button onClick={() => handleCheckAnswer(45)}>Check</Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl border-2 border-blue-300">
                            🤖
                        </div>
                        <div>
                            <DialogTitle>Multiplication Tutor</DialogTitle>
                            <DialogDescription>
                                Hi! I'm your study buddy. Let's learn step by step! 💙
                            </DialogDescription>
                        </div>
                    </div>
                    <Progress value={(currentLevel / 5) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Level {currentLevel} of 5</span>
                        <span>{LEVELS[currentLevel - 1].title}</span>
                    </div>
                </DialogHeader>

                <Card className="border-none shadow-none">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-primary">{LEVELS[currentLevel - 1].title}</CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[200px] flex flex-col justify-center">
                        {renderLevelContent()}
                    </CardContent>
                </Card>

                {feedback.message && (
                    <div className={`p-3 rounded-md text-center font-medium animate-in fade-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {feedback.message}
                    </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="ghost" onClick={onClose}>Maybe Later</Button>
                    {feedback.type === 'success' && (
                        <Button onClick={handleNextLevel} className="w-full sm:w-auto">
                            {currentLevel < 5 ? <>Next Level <ArrowRight className="ml-2 h-4 w-4" /></> : <>Finish <Star className="ml-2 h-4 w-4" /></>}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
