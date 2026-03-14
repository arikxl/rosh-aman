"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function GamePage() {
    // 1. Hooks ושאילתות בראש הקומפוננטה
    const [gameSeed] = useState(() => Date.now());
    const questions = useQuery(api.questions.getGameRound, { seed: gameSeed });
    const saveScore = useMutation(api.users.updateScore);
    const updateGameStats = useMutation(api.users.updateGameStats);

    // 2. States של המשחק
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [gameResults, setGameResults] = useState<{ topicId: string, isCorrect: boolean }[]>([]);
    const [timeLeft, setTimeLeft] = useState(10);

    // 3. יצירת Ref לפונקציה כדי למנוע שגיאות useEffect
    const handleAnswerRef = useRef<(index: number) => void>(() => { });

    // 4. פונקציית הטיפול בתשובה
    const handleAnswer = async (index: number) => {
        if (isChecking || questions === undefined || showResult) return;

        setIsChecking(true);
        setSelectedAnswer(index);

        const currentQuestion = questions[currentIndex];
        const isCorrect = index === currentQuestion.correctIndex;
        const finalPoints = isCorrect ? 1 : 0;

        const newResult = { topicId: currentQuestion.topicId, isCorrect };
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

    // עדכון ה-Ref בכל רינדור
    useEffect(() => {
        handleAnswerRef.current = handleAnswer;
    });

    // 5. לוגיקת הטיימר - יציבה ונקייה
    useEffect(() => {
        // עצירה אם אין שאלות, אם כבר ענה, או אם המשחק נגמר
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

    // 6. מסכי טעינה ושגיאות (Early Returns)
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-rtl">
                אין שאלות זמינות. נא להריץ Seed.
            </div>
        );
    }

    // 7. מסך תוצאות סופי
    if (showResult) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-right" dir="rtl">
                <h2 className="text-5xl font-bold mb-6 text-emerald-500 drop-shadow-lg">המבצע הושלם</h2>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-8 text-center w-full max-w-md shadow-2xl">
                    <p className="text-xl text-slate-400 mb-2 font-mono">ציון סופי:</p>
                    <p className="text-6xl font-black text-white">{score} <span className="text-2xl text-slate-600">/ {questions.length}</span></p>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Link href="/" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-2xl font-bold text-center shadow-lg">
                        חזרה למפקדה
                    </Link>
                    <Link href="/medals" className="px-8 py-4 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all rounded-2xl font-bold text-center">
                        צפה בארון העיטורים
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    // 8. ממשק המשחק
    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center font-sans" dir="rtl">
            <div className="w-full max-w-2xl mt-4 space-y-6">

                {/* שורה עליונה מאוחדת: סטטוס, פרוגרס וטיימר */}
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-3 text-xs font-mono tracking-tighter">
                        <div className="flex gap-3">
                            <span className="text-emerald-500">ניקוד: {score}</span>
                            <span className="text-slate-500">שאלה {currentIndex + 1}/{questions.length}</span>
                        </div>

                        {/* טיימר קומפקטי בצד שמאל */}
                        <div className={`flex items-center gap-2 font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                            <span className="text-[10px] uppercase">זמן נותר:</span>
                            <span className="text-lg">{timeLeft}</span>
                        </div>
                    </div>

                    {/* פס התקדמות דק */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 ease-out shadow-[0_0_10px] ${timeLeft <= 3 ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* כרטיסיית השאלה - צמצום Padding כדי לחסוך מקום */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-4xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full -mr-12 -mt-12"></div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight text-slate-100 min-h-20">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 gap-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctIndex;

                            let buttonStyle = "bg-slate-800/60 border-slate-700 hover:border-emerald-500/50";

                            if (selectedAnswer !== null) {
                                if (isCorrect) {
                                    buttonStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-400";
                                } else if (isSelected) {
                                    buttonStyle = "bg-red-600/20 border-red-500 text-red-400";
                                } else {
                                    buttonStyle = "bg-slate-900/30 border-slate-800 opacity-40";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={isChecking}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full p-4 border-2 rounded-xl text-right transition-all text-base md:text-lg flex justify-between items-center font-medium ${buttonStyle}`}
                                >
                                    <span className="text-xl font-mono opacity-80">
                                        {selectedAnswer !== null && isCorrect && "✓"}
                                        {selectedAnswer === index && !isCorrect && "✕"}
                                    </span>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );

}