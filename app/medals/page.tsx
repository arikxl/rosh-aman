"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield, Award, Crown, ArrowRight, Play, Target, Zap, ListChecks } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TOPIC_MEDALS, GENERIC_MEDALS, PLATINUM_MEDAL, type Medal } from "@/constants/medals";

export default function MedalsPage() {
    const { userId } = useAuth();
    const stats = useQuery(api.users.getUserStats, userId ? {} : "skip");

    if (!stats) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-500 animate-pulse font-mono tracking-widest text-xl">
                    סורק רשתות תקשורת...
                </div>
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

    // סינון המדליות הגנריות לקבוצות
    const gameRibbons = GENERIC_MEDALS.filter(m => m.id.startsWith("games"));
    const correctCoins = GENERIC_MEDALS.filter(m => m.id.startsWith("correct"));
    const perfectHexagons = GENERIC_MEDALS.filter(m => m.id.startsWith("perfect"));

    const unlockedTopics = TOPIC_MEDALS.filter(isMedalUnlocked);
    const unlockedGenerics = GENERIC_MEDALS.filter(isMedalUnlocked);

    const isPlatinumUnlocked =
        unlockedTopics.length === TOPIC_MEDALS.length &&
        unlockedGenerics.length === GENERIC_MEDALS.length;

    // רכיב עזר להצגת כותרת קטגוריה
    const SectionHeader = ({ title, icon: Icon, count, total }: any) => (
        <h3 className="text-xl font-bold mb-6 text-slate-300 flex items-center gap-3">
            <Icon className="w-5 h-5 text-emerald-500" />
            {title}
            <span className="text-slate-600 text-sm font-normal">({count} מתוך {total})</span>
        </h3>
    );

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 pb-24" dir="rtl">
            <div className="max-w-6xl mx-auto mt-8">

                {/* ניווט עליון */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
                    <h1 className="text-4xl font-black text-slate-100">ארון העיטורים</h1>
                    <div className="flex gap-4">
                        <Link href="/" className="px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-300 rounded-xl transition-all">
                            חזרה למפקדה
                        </Link>
                        <Link href="/game" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold">
                            מבצע חדש
                        </Link>
                    </div>
                </div>

                {/* מדליית הפלטינום (ראש אמ"ן) */}
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

                {/* התמחויות זירתיות */}
                <div className="mb-20">
                    <h2 className="text-2xl font-bold mb-8 text-emerald-500 flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Shield className="w-7 h-7" />
                        התמחויות זירתיות
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                        {TOPIC_MEDALS.map((medal) => {
                            const unlocked = isMedalUnlocked(medal);
                            const currentScore = Math.min(stats.correctAnswersByTopic?.[medal.id] || 0, medal.threshold);
                            return (
                                <div key={medal.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${unlocked ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-950/20 border-slate-900'}`}>
                                    <div className="relative w-24 h-28 mb-4">
                                        <Image src={unlocked && medal.iconUrl ? medal.iconUrl : "/imgs/locked_medal_generic.png"} alt={medal.name} fill className={`object-contain ${!unlocked ? 'grayscale brightness-50 opacity-40' : ''}`} />
                                    </div>
                                    <h4 className={`font-bold text-xs mb-3 h-8 flex items-center leading-tight ${unlocked ? 'text-slate-100' : 'text-slate-600'}`}>{medal.name}</h4>
                                    <p className={`text-[10px] leading-snug mt-1 mb-4 px-1 h-9 flex items-center justify-center
    ${unlocked ? 'text-slate-400' : 'text-slate-800 italic'}`}>
                                        {unlocked ? medal.description : "פרטי העיטור חסויים עד להשלמת היעד"}
                                    </p>                                   <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-auto">
                                        <div className={`h-full transition-all duration-1000 ${unlocked ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: `${(currentScore / medal.threshold) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* אבני דרך מבצעיות - מחולקות לשורות */}
                <div className="space-y-16">
                    <h2 className="text-2xl font-bold text-emerald-500 flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Award className="w-7 h-7" />
                        אבני דרך מבצעיות
                    </h2>

                    {/* שורה 1: אותות מלחמה (כמות משחקים) */}
                    <section>
                        <SectionHeader title="ותק מבצעי" icon={Zap} count={gameRibbons.filter(isMedalUnlocked).length} total={gameRibbons.length} />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {gameRibbons.map(medal => (
                                <GenericMedalCard key={medal.id} medal={medal} unlocked={isMedalUnlocked(medal)} currentValue={stats.totalGamesPlayed} iconPath="/imgs/locked_ribbon_generic.png" />
                            ))}
                        </div>
                    </section>

                    {/* שורה 2: מטבעות ידע (תשובות נכונות) */}
                    <section>
                        <SectionHeader title="מאגר ידע מצטבר" icon={ListChecks} count={correctCoins.filter(isMedalUnlocked).length} total={correctCoins.length} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {correctCoins.map(medal => (
                                <GenericMedalCard key={medal.id} medal={medal} unlocked={isMedalUnlocked(medal)} currentValue={stats.totalCorrectAnswers} iconPath="/imgs/locked_coin_generic.png" />
                            ))}
                        </div>
                    </section>

                    {/* שורה 3: מטבעות משושים (דיוק מושלם) */}
                    <section>
                        <SectionHeader title="רמת דיוק וביצוע" icon={Target} count={perfectHexagons.filter(isMedalUnlocked).length} total={perfectHexagons.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                            {perfectHexagons.map(medal => (
                                <GenericMedalCard key={medal.id} medal={medal} unlocked={isMedalUnlocked(medal)} currentValue={stats.perfectGames} iconPath="/imgs/locked_hex_generic.png" />
                            ))}
                        </div>
                    </section>
                </div>

            </div>
        </main>
    );
}

// רכיב עזר לכרטיס מדליה גנרית
function GenericMedalCard({ medal, unlocked, currentValue, iconPath }: any) {
    const progress = Math.min((currentValue / medal.threshold) * 100, 100);
    return (
        <div className={`p-6 rounded-2xl border flex  items-center gap-6 transition-all ${unlocked ? 'bg-slate-900 border-emerald-500/30' : 'bg-slate-950/40 border-slate-900 opacity-60'}`}>
            <div className="relative w-20 h-20 shrink-0">
                <Image src={unlocked && medal.iconUrl ? medal.iconUrl : iconPath} alt={medal.name} fill className={`object-contain ${!unlocked ? 'grayscale brightness-50' : ''}`} />
            </div>
            <div className="flex-1">
                <h4 className={`font-bold text-lg ${unlocked ? 'text-slate-100' : 'text-slate-600'}`}>{medal.name}</h4>
                <p className="text-sm text-slate-500 mb-4">{medal.description}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${unlocked ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
                    <span>{currentValue.toLocaleString()} / {medal.threshold.toLocaleString()}</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
            </div>
        </div>
    );
}