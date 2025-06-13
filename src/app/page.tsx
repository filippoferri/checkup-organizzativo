"use client";
import { useState } from "react";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import Login, { UserData } from "@/components/Login";
import Preliminari, { PreliminariData } from "@/components/Preliminari";
import Quiz, { QuizRisposte } from "@/components/Quiz";
import Results from "@/components/Results";

export default function Home() {
  const [step, setStep] = useState(0);
  const [_user, setUser] = useState<UserData | null>(null);
  const [_preliminari, setPreliminari] = useState<PreliminariData | null>(null);
  const [quiz, setQuiz] = useState<QuizRisposte | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNav />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
          {step === 0 && (
            <Login onNext={(userData: UserData) => {
              setUser(userData);    // salva email/nome
              setStep(1);           // vai a preliminari
            }} />
          )}
          {step === 1 && (
            <Preliminari onNext={(preliminariData: PreliminariData) => {
              setPreliminari(preliminariData);
              setStep(2);           // qui in futuro: vai a quiz
            }} />
          )}
          {step === 2 && (
            <Quiz onNext={quizData => {
              setQuiz(quizData);
              setStep(3);
            }} />
          )}
          {step === 3 && quiz && _user && _preliminari && ( // Ensure _user and _preliminari are not null
            <Results
              quiz={quiz}
              email={_user.email} // Pass email from _user state
              name={_user.name}   // Pass nome from _user state (if it exists)
              azienda_dim={_preliminari.dim} // Corrected: Pass dim from _preliminari state
              azienda_settore={_preliminari.settore} // Corrected: Pass settore
              azienda_digitalizzazione={_preliminari.dig} // Corrected: Pass dig (digitalizzazione)
              azienda_ai={_preliminari.ai} // Corrected: Pass ai
              onRestart={() => {
                setUser(null); // Also reset user and preliminari data on restart
                setPreliminari(null);
                setQuiz(null);
                setStep(0);
              }}
            />
          )}
          </div>
      </main>
      <Footer />
    </div>
  );
}
