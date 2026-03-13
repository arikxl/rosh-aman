"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

export default function GamePage() {
    // שליפת השאלות והמוטציות מה-Backend
    const questions = useQuery(api.questions.getGameRound);
    const saveScore = useMutation(api.users.updateScore);
    const updateGameStats = useMutation(api.users.updateGameStats); // הפונקציה החדשה למדליות

    // ניהול מצב המשחק
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    // מצב טעינה
    if (questions === undefined) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-500 animate-pulse font-mono tracking-widest">
                    מתחבר לשרת הנתונים...
                </div>
            </div>
        );
    }

    // אם אין שאלות בכלל
    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                אין שאלות במאגר. יש להריץ את ה-Seed.
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    const handleAnswer = async (index: number) => {
        if (isChecking) return; // מונע לחיצות כפולות בזמן הבדיקה

        setIsChecking(true);
        setSelectedAnswer(index);

        const isCorrect = index === currentQuestion.correctIndex;
        const finalPoints = isCorrect ? 1 : 0; // הנקודה של השאלה הנוכחית

        // מחכים 1.5 שניות כדי שהמשתמש יראה את התוצאה
        setTimeout(async () => {
            if (isCorrect) setScore(prev => prev + 1);

            // אם יש עוד שאלות - עוברים לשאלה הבאה
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null); // מאפסים לבחירה הבאה
                setIsChecking(false);
            }
            // אם זו השאלה האחרונה - שומרים נתונים ומסיימים
            else {
                // מחשבים את הציון הסופי המדויק (הציון שנצבר + התשובה האחרונה)
                const finalScore = score + finalPoints;

                try {
                    // 1. שמירת הניקוד הרגיל לטבלת המובילים (הקוד הישן והטוב שלך)
                    await saveScore({ pointsToAdd: finalScore });

                    // 2. שמירת הסטטיסטיקות עבור המדליות (הקוד החדש!)
                    await updateGameStats({
                        correctAnswersCount: finalScore, // כמה ענה נכון
                        totalQuestionsInGame: questions.length, // כמה שאלות היו (לרוב 10)
                        topicId: questions[0].topicId, // שואב אוטומטית את שם הנושא מהשאלה הראשונה במשחק
                    });
                } catch (error) {
                    console.error("שגיאה בשמירת נתוני המשחק:", error);
                }

                // מציגים את מסך הסיום
                setShowResult(true);
            }
        }, 1500);
    };

    // מסך סיום מבצע
    if (showResult) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-right">
                <h2 className="text-4xl font-bold mb-4">המבצע הושלם</h2>
                <p className="text-2xl mb-8">דירוג סופי: {score} מתוך {questions.length}</p>
                <Link href="/" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-lg font-bold">
                    חזרה למפקדה
                </Link>
                {/* הוספתי כפתור מעבר ישיר לארון המדליות */}
                <Link href="/medals" className="px-8 py-3 mt-4 border border-emerald-600 text-emerald-500 hover:bg-emerald-900/30 transition-colors rounded-lg font-bold">
                    צפה בארון ההישגים
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center">
            <div className="w-full max-w-2xl mt-12">
                {/* פרוגרס בר עליון */}
                <div className="flex justify-between items-end mb-6 font-mono text-emerald-500 text-sm">
                    <span>ניקוד: {score}</span>
                    <span>שאלה {currentIndex + 1} מתוך {questions.length}</span>
                </div>

                <div className="h-1 w-full bg-slate-800 rounded-full mb-12">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_#10b981]"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* השאלה */}
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-right">
                    <h2 className="text-3xl font-bold mb-10 leading-tight">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.options.map((option, index) => {
                            // לוגיקת צביעה
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctIndex;

                            let buttonStyle = "bg-slate-800 border-slate-700 hover:border-emerald-500";

                            if (selectedAnswer !== null) {
                                if (isCorrect) {
                                    buttonStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                                } else if (isSelected) {
                                    buttonStyle = "bg-red-600/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                                } else {
                                    buttonStyle = "bg-slate-800/50 border-slate-800 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    disabled={isChecking}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full p-5 border rounded-xl text-right transition-all text-lg flex justify-between items-center group ${buttonStyle}`}
                                >
                                    <span className="text-xl">
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