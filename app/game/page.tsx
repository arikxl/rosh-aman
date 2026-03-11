"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";

export default function GamePage() {
    // שליפת השאלות מה-Backend
    const questions = useQuery(api.questions.getAll);
    const saveScore = useMutation(api.users.updateScore);

    // ניהול מצב המשחק
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

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
        const isCorrect = index === currentQuestion.correctIndex;
        // אנחנו מחשבים את הניקוד הסופי רגע לפני השליחה
        const finalPoints = score + (isCorrect ? 1 : 0);

        if (isCorrect) setScore(prev => prev + 1);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            try {
                // שליחת הניקוד ל-DB
                await saveScore({ pointsToAdd: finalPoints });
                setShowResult(true);
            } catch (err) {
                console.error("שגיאה בשמירת הניקוד:", err);
                // גם אם השמירה נכשלה, נציג את מסך הסיום כדי שהמשתמש לא ייתקע
                setShowResult(true);
            }
        }
    };

    
    // מסך סיום מבצע
    if (showResult) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-right">
                <h2 className="text-4xl font-bold mb-4">המבצע הושלם</h2>
                <p className="text-2xl mb-8">דירוג סופי: {score} מתוך {questions.length}</p>
                <Link href="/" className="px-8 py-3 bg-emerald-600 rounded-lg font-bold">
                    חזרה למטה
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
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className="w-full p-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 rounded-xl text-right transition-all text-lg group flex justify-between items-center"
                            >
                                <span className="opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity">◀</span>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}