"use client";
import { useState } from "react";

export interface UserData {
  email: string;
  nome?: string;
}

interface LoginProps {
  onNext: (data: UserData) => void;
}

export default function Login({ onNext }: LoginProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  // Chiamato quando premi Avanti (submit form)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && consent) {
      onNext({ email }); // Passa i dati allo step successivo!
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 border-t-8 border-[#489FB5]"
    >
      <h1 className="text-3xl font-bold text-[#16697A] text-center">Checkup Organizzativo</h1>
      <p className="text-[#489FB5] text-center">L'autovalutazione gratuita per le PMI italiane</p>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="La tua email"
        className="border border-[#16697A] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA62B]"
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
        />
        <span className="text-xs text-[#489FB5]">Acconsento al trattamento dei dati personali</span>
      </label>
      <button
        type="submit"
        disabled={!email || !consent}
        className="bg-[#FFA62B] text-[#16697A] font-bold px-6 py-3 rounded-xl disabled:opacity-40 transition"
      >
        Avanti
      </button>
    </form>
  );
}
