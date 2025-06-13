"use client";
import { useState } from "react";
import Image from "next/image";

export interface UserData {
  email: string;
  name: string;
}

interface LoginProps {
  onNext: (data: UserData) => void;
}

export default function Login({ onNext }: LoginProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);

  // Chiamato quando premi Avanti (submit form)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && consent) {
      onNext({ email, name }); // Passa i dati allo step successivo!
    }
  };

  return (
    <section className="w-full bg-white p-8 flex flex-col gap-6 rounded-2xl">
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-8 flex flex-col gap-6"
    >
      <Image src="/logo-dark.svg" alt="Checkup Organizzativo™" className="h-16 w-auto" width={200} height={64} />
      <h2 className="text-xl text-sky-900 text-center">L&apos;autovalutazione gratuita per le PMI italiane.</h2>
      <p className="text-center">Dove dobbiamo inviare i risultati del Checkup?</p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Il tuo nome"
        className="border border-sky-900 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="La tua email di lavoro"
        className="border border-sky-900 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        required
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={e => setConsent(e.target.checked)}
        />
        <span className="text-s text-sky-900">Acconsento al trattamento dei dati personali</span>
      </label>
      <button
        type="submit"
        disabled={!email || !consent}
        className="bg-teal-200 text-black font-bold px-6 py-3 rounded-xl disabled:opacity-40 transition cursor-pointer"
      >
        Avanti
      </button>
    </form>
    </section>
  );
}
