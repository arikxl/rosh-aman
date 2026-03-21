"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// 1. פונקציית ה-Hook של המכונת כתיבה (מוגדרת מחוץ לקומפוננטה)
function useTypewriter(text: string | undefined, speed: number = 20) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!text) return;
        setDisplayedText(""); // איפוס בכל פעם שהשאלה מתחלפת

        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return displayedText;
}

export default function GamePage() {
    // 2. Hooks ושאילתות
    const [gameSeed, setGameSeed] = useState(() => Date.now());
    const questions = useQuery(api.questions.getGameRound, { seed: gameSeed });
    const saveScore = useMutation(api.users.updateScore);
    const updateGameStats = useMutation(api.users.updateGameStats);

    // 3. States של המשחק
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [gameResults, setGameResults] = useState<{ topicId: string, isCorrect: boolean }[]>([]);
    const [timeLeft, setTimeLeft] = useState(10);

    // חילוץ השאלה הנוכחית בבטחה
    const currentQuestion = questions ? questions[currentIndex] : null;

    // 4. הפעלת אפקט המכונת כתיבה על טקסט השאלה
    const displayedQuestionText = useTypewriter(currentQuestion?.text);

    const handleAnswerRef = useRef<(index: number) => void>(() => { });

    // 5. פונקציית הטיפול בתשובה
    const handleAnswer = async (index: number) => {
        if (isChecking || !questions || showResult) return;

        setIsChecking(true);
        setSelectedAnswer(index);

        const currentQ = questions[currentIndex];
        const isCorrect = index === currentQ.correctIndex;
        const finalPoints = isCorrect ? 1 : 0;

        const newResult = { topicId: currentQ.topicId, isCorrect };
        const updatedResults = [...gameResults, newResult];
        setGameResults(updatedResults);

        setTimeout(async () => {
            if (isCorrect) setScore(prev => prev + 1);

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsChecking(false);
                setTimeLeft(10);
            } else {
                try {
                    await saveScore({ pointsToAdd: score + finalPoints });
                    await updateGameStats({ results: updatedResults });
                } catch (err) {
                    console.error("Failed to save stats:", err);
                }
                setShowResult(true);
            }
        }, 1500);
    };

    useEffect(() => {
        handleAnswerRef.current = handleAnswer;
    });

    // 6. לוגיקת הטיימר
    useEffect(() => {
        if (!questions || showResult || selectedAnswer !== null || isChecking) return;

        if (timeLeft <= 0) {
            handleAnswerRef.current(-1);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [questions, showResult, selectedAnswer, timeLeft, isChecking]);

    // 7. מסכי טעינה ושגיאות
    if (questions === undefined) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-500 animate-pulse font-mono tracking-widest text-xl">
                    מתחבר למאגרי המודיעין...
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-right" dir="rtl">
                אין שאלות זמינות. נא להריץ Seed.
            </div>
        );
    }


    const handleRestart = () => {
        setGameSeed(Date.now()); // יגרום ל-Convex למשוך שאלות חדשות
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsChecking(false);
        setGameResults([]);
        setTimeLeft(10);
    };

    // 8. מסך תוצאות סופי
    if (showResult) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-right" dir="rtl">
                <h2 className="text-5xl font-black mb-6 text-emerald-500 italic uppercase">המבצע הושלם</h2>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-8 text-center w-full max-w-md shadow-2xl">
                    <p className="text-xl text-slate-400 mb-2 font-mono uppercase tracking-tighter">ציון סופי:</p>
                    <p className="text-7xl font-black text-white">{score} <span className="text-2xl text-slate-700">/ {questions.length}</span></p>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Link href="/" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-2xl font-bold text-center shadow-lg">
                        חזרה למפקדה
                    </Link>
                    <Link href="/medals" className="px-8 py-4 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all rounded-2xl font-bold text-center">
                        צפיה בארון העיטורים
                    </Link>
                    {/* במקום ה-Link המקורי: */}
                    <button
                        onClick={handleRestart}
                        className="px-8 py-4 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all rounded-2xl font-bold text-center cursor-pointer"
                    >
                        יציאה למבצע חדש
                    </button>
                </div>
            </div>
        );
    }

    // 9. ממשק המשחק הפעיל
    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center font-sans" dir="rtl">
            <div className="w-full max-w-2xl mt-4 space-y-6">

                {/* שורה עליונה: סטטוס וטיימר */}
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-sm backdrop-blur-md">
                    <div className="flex justify-between items-center mb-3 text-[10px] font-mono tracking-widest uppercase">
                        <div className="flex gap-4">
                            <span className="text-emerald-500 font-bold">ניקוד: {score}</span>
                            <span className="text-slate-500"> שאלה: {currentIndex + 1}/{questions.length}</span>
                        </div>

                        <div className={`flex items-center gap-2 font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                            <span>SEC: {timeLeft}</span>
                        </div>
                    </div>

                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 ease-out ${timeLeft <= 3 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* כרטיסיית השאלה עם אפקט המכונת כתיבה */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-4xl shadow-2xl relative min-h-[300px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>

                    <div className="relative">
                        <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-emerald-400 font-mono tracking-tight text-right italic">
                            {displayedQuestionText}
                            {/* סמן מהבהב */}
                            <span className="inline-block w-2 h-6 bg-emerald-500 mr-1 animate-pulse align-middle"></span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mt-8">
                        {currentQuestion?.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctIndex;

                            let buttonStyle = "bg-slate-800/40 border-slate-700 hover:border-emerald-500/50";

                            if (selectedAnswer !== null) {
                                if (isCorrect) {
                                    buttonStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                                } else if (isSelected) {
                                    buttonStyle = "bg-red-600/20 border-red-500 text-red-400";
                                } else {
                                    buttonStyle = "bg-slate-900/30 border-slate-800 opacity-40";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={isChecking || selectedAnswer !== null}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full p-4 border-2 rounded-xl transition-all text-base md:text-lg flex items-center justify-center gap-3 font-bold ${buttonStyle}`}
                                >
                                    {/* האייקון יופיע רק כשצריך ויעמוד לצד הטקסט במרכז */}
                                    {(selectedAnswer !== null) && (
                                        <span className="text-xl font-mono">
                                            {isCorrect ? "✓" : (isSelected ? "✕" : "")}
                                        </span>
                                    )}

                                    <span>{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}