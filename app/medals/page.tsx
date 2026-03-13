"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield, Award, Crown, Lock, ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { TOPIC_MEDALS, GENERIC_MEDALS, PLATINUM_MEDAL, type Medal } from "@/constants/medals";

export default function MedalsPage() {
    const { userId } = useAuth();
    const stats = useQuery(api.users.getUserStats, userId ? {} : "skip");


    if (stats === undefined) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-500 animate-pulse font-mono tracking-widest">
                    שולף נתוני מודיעין ומדליות...
                </div>
            </div>
        );
    }

    if (stats === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
                <p>משתמש לא נמצא.</p>
                <Link href="/" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg">חזרה למפקדה</Link>
            </div>
        );
    }

    const isMedalUnlocked = (medal: Medal) => {
        if (medal.type === "topic") {
            return (stats.correctAnswersByTopic?.[medal.id] || 0) >= medal.threshold;
        }
        if (medal.type === "generic") {
            if (medal.id.startsWith("games")) return stats.totalGamesPlayed >= medal.threshold;
            if (medal.id.startsWith("correct")) return stats.totalCorrectAnswers >= medal.threshold;
            if (medal.id.startsWith("perfect")) return stats.perfectGames >= medal.threshold;
        }
        return false;
    };

    const unlockedTopics = TOPIC_MEDALS.filter(isMedalUnlocked);
    const unlockedGenerics = GENERIC_MEDALS.filter(isMedalUnlocked);

    const isPlatinumUnlocked =
        unlockedTopics.length === TOPIC_MEDALS.length &&
        unlockedGenerics.length === GENERIC_MEDALS.length;

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 dir-rtl" dir="rtl">
            <div className="max-w-6xl mx-auto mt-8">

                {/* ניווט עליון */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                    <h1 className="text-4xl font-bold text-slate-100 drop-shadow-md">ארון ההישגים והעיטורים</h1>
                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 rounded-xl transition-all shadow-lg"
                        >
                            <ArrowRight className="w-5 h-5" />
                            חזרה למפקדה
                        </Link>
                        <Link
                            href="/game"
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] font-bold"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            מבצע חדש
                        </Link>
                    </div>
                </div>

                {/* מדליית הפלטינום (אגדת מודיעין) */}
                <div className="mb-16">
                    <div className={`p-8 rounded-3xl border-2 text-center transition-all duration-500 ${isPlatinumUnlocked ? 'bg-slate-900 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]' : 'bg-slate-900/50 border-slate-800 opacity-70'}`}>
                        <Crown className={`w-20 h-20 mx-auto mb-4 ${isPlatinumUnlocked ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-slate-600'}`} />
                        <h2 className={`text-3xl font-black tracking-wide ${isPlatinumUnlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                            {PLATINUM_MEDAL.name}
                        </h2>
                        <p className={`mt-2 text-lg ${isPlatinumUnlocked ? 'text-yellow-200/80 font-medium' : 'text-slate-600'}`}>
                            {PLATINUM_MEDAL.description}
                        </p>
                    </div>
                </div>

                {/* מדליות נושאים (זירות מודיעין) */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-emerald-500 flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Shield className="w-7 h-7" />
                        התמחויות זירתיות <span className="text-slate-500 text-lg font-normal">({unlockedTopics.length} מתוך {TOPIC_MEDALS.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                        {TOPIC_MEDALS.map((medal) => {
                            const unlocked = isMedalUnlocked(medal);
                            const currentScore = Math.min(stats.correctAnswersByTopic?.[medal.id] || 0, medal.threshold);

                            return (
                                <div key={medal.id} className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-300 ${unlocked ? 'bg-slate-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] transform hover:-translate-y-1' : 'bg-slate-900/40 border-slate-800 opacity-60 grayscale'}`}>
                                    {unlocked ? <Shield className="w-12 h-12 text-emerald-400 mb-4 drop-shadow-md" /> : <Lock className="w-12 h-12 text-slate-600 mb-4" />}
                                    <h4 className={`font-bold text-sm mb-2 ${unlocked ? 'text-slate-100' : 'text-slate-500'}`}>{medal.name}</h4>

                                    {/* פרוגרס בר */}
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-auto">
                                        <div
                                            className={`h-1.5 rounded-full transition-all duration-1000 ${unlocked ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}
                                            style={{ width: `${(currentScore / medal.threshold) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className={`text-[11px] mt-3 leading-snug px-1 ${unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {medal.description}
                                    </p>
                                    {/* <span className="text-[11px] font-mono text-slate-400 mt-2">
                                        {currentScore} / {medal.threshold}
                                    </span> */}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* מדליות גנריות (אבני דרך מבצעיות) */}
                {/* מדליות גנריות (אבני דרך מבצעיות) */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-emerald-500 flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Award className="w-7 h-7" />
                        אבני דרך מבצעיות <span className="text-slate-500 text-lg font-normal">({unlockedGenerics.length} מתוך {GENERIC_MEDALS.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {GENERIC_MEDALS.map((medal) => {
                            const unlocked = isMedalUnlocked(medal);

                            // חישוב התקדמות ספציפי למדליות גנריות
                            let currentValue = 0;
                            if (medal.id.startsWith("games")) currentValue = stats.totalGamesPlayed;
                            if (medal.id.startsWith("correct")) currentValue = stats.totalCorrectAnswers;
                            if (medal.id.startsWith("perfect")) currentValue = stats.perfectGames;

                            const progress = Math.min((currentValue / medal.threshold) * 100, 100);

                            return (
                                <div key={medal.id} className={`p-6 rounded-2xl border flex flex-col transition-all duration-300 ${unlocked ? 'bg-slate-900 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}>
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className={`p-4 rounded-full ${unlocked ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                                            {unlocked ? <Award className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                                        </div>
                                        <div className="text-right flex-1">
                                            <h4 className={`font-bold text-lg mb-1 ${unlocked ? 'text-slate-100' : 'text-slate-500'}`}>{medal.name}</h4>
                                            <p className="text-sm text-slate-400 leading-relaxed">{medal.description}</p>
                                        </div>
                                    </div>

                                    {/* פרוגרס בר גנרי */}
                                    <div className="mt-auto pt-2">
                                        <div className="flex justify-between items-center mb-1.5 px-1">
                                            <span className="text-[10px] font-mono text-slate-500">
                                                {currentValue.toLocaleString()} / {medal.threshold.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-500/80">
                                                {Math.floor(progress)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-1000 ${unlocked ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </main>
    );
}