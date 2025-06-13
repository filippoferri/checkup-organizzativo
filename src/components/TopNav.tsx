"use client";

import Image from 'next/image';

export default function TopNav() {
  return (

    <header className="bg-sky-900 shadow-sm py-4">
    <nav className="max-w-7xl mx-auto px-4">
      <Image src="/logo.svg" alt="Checkup Organizzativo" className="h-16 w-auto" width={200} height={64} />
    </nav>
  </header>


  );
}