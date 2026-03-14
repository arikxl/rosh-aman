"use client";

import Link from "next/link";
import { Shield, ChevronRight, Mail, Heart } from "lucide-react";

export default function AccessibilityPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden font-sans" dir="rtl">
            {/* אפקט הגריד המבצעי */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>

            <div className="relative z-10 max-w-3xl mx-auto mt-10">
                <header className="mb-10 text-right">
                    <Link href="/" className="inline-flex items-center text-emerald-500 hover:text-emerald-400 transition-colors mb-6 group font-heebo">
                        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                        חזרה למפקדה
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight bg-linear-to-l from-white to-slate-500 bg-clip-text text-transparent italic">
                        הצהרת נגישות ומחויבות אישית
                    </h1>
                    <div className="h-1 w-20 bg-emerald-500 mt-4 rounded-full shadow-[0_0_10px_#10b981]"></div>
                </header>

                <section className="space-y-8 text-slate-300 leading-relaxed bg-slate-900/40 p-8 rounded-4xl border border-slate-800 backdrop-blur-sm shadow-2xl text-right font-heebo">

                    {/* מסר אישי מהמפתח */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 p-4 opacity-10">
                            <Heart className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h2 className="text-emerald-400 font-bold text-xl mb-3 flex items-center gap-2">
                            דבר המפתח
                        </h2>
                        <p className="text-slate-200">
                            נושא הנגישות הדיגיטלית חשוב מאוד לליבי. פרויקט &quot;ראש אמ&quot;ן&quot; הוקם בהתנדבות מלאה ופועל <strong>ללא מטרת רווח</strong>, מתוך רצון להנגיש ידע גיאופוליטי בצורה חווייתית לכלל הציבור.
                        </p>
                        <p className="mt-3 text-slate-200">
                            במידה וחסר לכם משהו באתר מבחינת נגישות, או שיש לכם הצעה לתיקון או שיפור שיכולים להקל על השימוש שלכם – דלתי תמיד פתוחה בפניכם.
                        </p>

                        <div className="mt-6 flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800 w-fit">
                            <Mail className="w-5 h-5 text-emerald-500" />
                            <span className="text-slate-400 text-sm ml-2">פניות בנושאי נגישות:</span>
                            <a href="mailto:arikxl@gmail.com" className="text-emerald-400 font-bold hover:underline">
                                arikxl@gmail.com
                            </a>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-white font-bold text-xl mb-3">סטטוס נגישות טכני</h2>
                        <p>
                            למרות היותו מיזם עצמאי, האתר הותאם לדרישות הנגישות ברמה <strong>AA</strong> לפי תקן WCAG 2.1 ככל הניתן. התאמות אלו כוללות:
                        </p>
                        <ul className="list-disc list-inside mt-4 space-y-2 mr-4 text-slate-400">
                            <li>ניווט מלא באמצעות המקלדת.</li>
                            <li>התאמה לקוראי מסך ושימוש בתגיות סמנטיות.</li>
                            <li>עיצוב בניגודיות גבוהה כברירת מחדל.</li>
                            <li>מבנה רספונסיבי המותאם לכל סוגי המסכים.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-white font-bold text-xl mb-3">דיווח על תקלות</h2>
                        <p>
                            אנו ממשיכים להשקיע מאמצים בשיפור הנגישות. אם נתקלתם בבעיה טכנית, אשמח מאוד אם תעדכנו אותי במייל המופיע לעיל כדי שאוכל לתקן זאת בהקדם האפשרי למען כלל הקהילה.
                        </p>
                    </div>

                </section>

                <footer className="mt-12 text-center opacity-40">
                    <Shield className="w-10 h-10 mx-auto mb-4 text-slate-600" />
                    <p className="text-[10px] font-mono tracking-[0.3em] uppercase">
                        Protocol: Accessibility // Non-Profit Mission
                    </p>
                </footer>
            </div>
        </main>
    );
}