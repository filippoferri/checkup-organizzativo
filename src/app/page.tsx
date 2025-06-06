"use client";
import { useState } from "react";
import Login, { UserData } from "@/components/Login";
import Preliminari, { PreliminariData } from "@/components/Preliminari";
// import Quiz from "@/components/Quiz";
// import Results from "@/components/Results";

export default function Home() {
  const [step, setStep] = useState(0);
  const [_user, setUser] = useState<UserData | null>(null);
  const [_preliminari, setPreliminari] = useState<PreliminariData | null>(null);

  return (
    <main className="min-h-screen bg-[#EDE7E3] flex flex-col items-center justify-center">
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
      {/* 
      {step === 2 && (
        <Quiz user={user} preliminari={preliminari} onNext={...} />
      )}
      {step === 3 && (
        <Results ... />
      )} 
      */}
    </main>
  );
}
