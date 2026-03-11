"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  // אנחנו משתמשים ב-Hook כדי לבדוק אם המשתמש מחובר
  const { isSignedIn, isLoaded } = useAuth();
  const userData = useQuery(api.users.getMyData);

  // אם המערכת עדיין טוענת את מצב המשתמש
  if (!isLoaded) return <div className="min-h-screen bg-slate-950" />;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-right font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="z-10 w-full max-w-2xl text-center">
        <header className="mb-16">
          <div className="inline-block px-4 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-full text-emerald-400 text-sm mb-4 tracking-widest uppercase">
            מערכת הערכת מודיעין
          </div>
          <h1 className="text-7xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            ראש אמ&quot;ן
          </h1>
          <p className="text-xl text-slate-400 max-w-md mx-auto leading-relaxed font-heebo">
            האם יש לך את מה שנדרש כדי לשלוט במידע האסטרטגי של המזרח התיכון?
          </p>
        </header>

        <div className="flex flex-col items-center gap-6">
          {!isSignedIn ? (
            /* מצב: לא מחובר */
            <>
              <p className="text-slate-500 mb-2 font-heebo">יש להזדהות כדי להתחיל בצבירת עיטורים</p>
              <SignInButton mode="modal">
                <button className="group relative px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-heebo">
                  כניסה למערכת
                </button>
              </SignInButton>
            </>
          ) : (
            /* מצב: מחובר */
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-2xl border border-slate-800">
                <UserButton  />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-slate-400 text-xs uppercase tracking-tighter">ניקוד מצטבר</span>
                    <span className="text-emerald-400 font-bold text-xl">
                      {userData?.totalPoints || 0} נקודות
                    </span>
                  </div>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <Link href="/game" className="p-6 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 rounded-xl text-2xl font-bold transition-all text-emerald-400 font-heebo">
                  התחלת מבצע 🚀
                </Link>
                <Link href="/medals" className="p-6 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-2xl font-bold transition-all text-white font-heebo">
                  ארון עיטורים 🎖️
                </Link>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-24 text-slate-600 text-[10px] tracking-[0.3em] uppercase opacity-50">
          Classification: Top Secret | Unit 8200 | v1.0.0
        </footer>
      </div>
    </main>
  );
}