"use client";
import { useState } from "react";

export interface CheckupResponse {
    id: number;
    email: string;
    nome: string;
    azienda_dim: string;
    azienda_settore: string;
    azienda_digitalizzazione: string;
    azienda_ai: string;
    risposte: number[];
    risultato: number;
    data: string;
}

export default function AdminPanel() {
    const [password, setPassword] = useState("");
    const [ok, setOk] = useState(false);
    const [data, setData] = useState<CheckupResponse[]>([]);
    const [loading, setLoading] = useState(false);

  // Cambia qui la password admin (oppure passa da env)
    const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "checkup2024";

    async function fetchData() {
        setLoading(true);
        const res = await fetch("/api/checkup");
        const json = await res.json();
        setData(json);
        setLoading(false);
    }

    function downloadCSV() {
        const header = Object.keys(data[0]).join(",");
        const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
        const blob = new Blob([header + "\n" + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'checkup_responses.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    if (!ok) {
        return (
        <div className="max-w-xs w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 mt-6">
            <h2 className="text-xl font-bold text-[#16697A] text-center mb-2">Admin Login</h2>
            <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password admin"
            className="border border-[#489FB5] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA62B]"
            />
            <button
            onClick={() => setOk(password === ADMIN_PASS)}
            className="bg-[#FFA62B] text-[#16697A] font-bold px-6 py-3 rounded-xl"
            >
            Entra
            </button>
        </div>
        );
    }

    return (
        <section className="max-w-6xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 border-t-8 border-[#489FB5] mt-4">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#16697A] mb-2">Risposte Checkup</h2>
            <button
            className="bg-[#FFA62B] text-[#16697A] font-bold px-4 py-2 rounded-xl"
            onClick={downloadCSV}
            disabled={!data.length}
            >
            Export CSV
            </button>
        </div>
        <button
            onClick={fetchData}
            className="bg-[#489FB5] text-white px-4 py-2 rounded-xl font-bold mb-4"
        >
            Carica Risposte
        </button>
        {loading ? (
            <div className="text-[#489FB5] text-center">Caricamento...</div>
        ) : data.length === 0 ? (
            <div className="text-[#489FB5] text-center">Nessuna risposta trovata</div>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full text-xs border">
                <thead className="bg-[#EDE7E3] text-[#16697A]">
                <tr>
                    <th className="px-2 py-1">Email</th>
                    <th className="px-2 py-1">Data</th>
                    <th className="px-2 py-1">Dimensione</th>
                    <th className="px-2 py-1">Settore</th>
                    <th className="px-2 py-1">Digitalizzazione</th>
                    <th className="px-2 py-1">AI</th>
                    <th className="px-2 py-1">Risultato</th>
                    <th className="px-2 py-1">Azioni</th>
                </tr>
                </thead>
                <tbody>
                {data.map(row => (
                    <tr key={row.id} className="border-b hover:bg-[#F5F5F5]">
                    <td className="px-2 py-1 font-bold text-[#489FB5]">{row.email}</td>
                    <td className="px-2 py-1">{row.data.slice(0, 16).replace("T", " ")}</td>
                    <td className="px-2 py-1">{row.azienda_dim}</td>
                    <td className="px-2 py-1">{row.azienda_settore}</td>
                    <td className="px-2 py-1">{row.azienda_digitalizzazione}</td>
                    <td className="px-2 py-1">{row.azienda_ai}</td>
                    <td className="px-2 py-1 text-center font-bold text-[#FFA62B]">{row.risultato}%</td>
                    <td className="px-2 py-1">
                        <details>
                        <summary className="underline cursor-pointer">Dettaglio</summary>
                        <pre className="text-[10px] mt-2 max-w-xs whitespace-pre-wrap bg-[#F7F7F7] rounded p-2">{JSON.stringify(row, null, 2)}</pre>
                        </details>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </section>
    );
}