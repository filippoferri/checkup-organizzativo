    "use client";
    import { useState } from "react";

    const dimensioni = [
        { value: "micro", label: "Micro (meno di 10 dipendenti)" },
        { value: "piccola", label: "Piccola (10-49 dipendenti)" },
        { value: "media", label: "Media (50-249 dipendenti)" },
    ];

    const settori = [
        "Manifatturiero/Industriale",
        "Commercio all’ingrosso",
        "Commercio al dettaglio",
        "Servizi professionali (consulenza, formazione, IT, ecc.)",
        "Servizi alla persona",
        "Logistica/Trasporti",
        "Edilizia/Costruzioni",
        "Agricoltura/Agroalimentare",
        "Turismo/Ristorazione",
        "Artigianato",
        "Sanità/Salute",
        "Altro",
    ];

    const digitalizzazione = [
        { value: "base", label: "Base (utilizzo minimo di strumenti digitali)" },
        { value: "intermedio", label: "Intermedio (alcuni processi digitalizzati)" },
        { value: "avanzato", label: "Avanzato (ampio utilizzo di strumenti digitali)" },
    ];

    const aiOptions = [
        { value: "nessuno", label: "Nessuno" },
        { value: "valutazione", label: "In fase di valutazione" },
        { value: "prototipo", label: "Prototipo/Test" },
        { value: "parziale", label: "Integrati in alcuni processi" },
        { value: "trasversale", label: "Integrati in modo trasversale" },
    ];

    export interface PreliminariData {
        dim: string;
        settore: string;
        dig: string;
        ai: string;
    }

    interface PreliminariProps {
        onNext: (data: PreliminariData) => void;
    }

    export default function Preliminari({ onNext }: PreliminariProps) {
        const [dim, setDim] = useState("");
        const [settore, setSettore] = useState("");
        const [altroSettore, setAltroSettore] = useState("");
        const [dig, setDig] = useState("");
        const [ai, setAi] = useState("");

        const settoreFinale = settore !== "Altro" ? settore : altroSettore;
        const valido = dim && settore && (settore !== "Altro" || altroSettore) && dig && ai;

        return (
            <section className="w-full bg-white p-8 flex flex-col gap-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-sky-900 text-center mb-2">Informazioni preliminari</h2>
                <h3 className="text-sky-900 text-center text-xl mb-4">
                    Queste informazioni aiuteranno a personalizzare i risultati del Checkup Organizzativo. 
                </h3>
                {/* Dimensione azienda */}
                <div>
                    <label className="font-semibold text-sky-900 mb-1 block">Dimensione azienda</label>
                    <div className="flex flex-col gap-2">
                    {dimensioni.map((d) => (
                        <label key={d.value} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="dimensione"
                            value={d.value}
                            checked={dim === d.value}
                            onChange={() => setDim(d.value)}
                        />
                        <span>{d.label}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* Settore */}
                <div>
                    <label className="font-semibold text-sky-900 mb-1 block">Settore principale di attività</label>
                    <select
                    value={settore}
                    onChange={e => setSettore(e.target.value)}
                    className="border border-[#89B1DD] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    >
                    <option value="">Seleziona settore</option>
                    {settori.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                    </select>
                    {settore === "Altro" && (
                    <input
                        type="text"
                        value={altroSettore}
                        onChange={e => setAltroSettore(e.target.value)}
                        placeholder="Specifica il settore"
                        className="mt-2 border border-[#89B1DD] rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200 w-full"
                    />
                    )}
                </div>

                {/* Digitalizzazione */}
                <div>
                    <label className="font-semibold text-sky-900 mb-1 block">Livello di digitalizzazione percepito</label>
                    <div className="flex flex-col gap-2">
                    {digitalizzazione.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="digitalizzazione"
                            value={opt.value}
                            checked={dig === opt.value}
                            onChange={() => setDig(opt.value)}
                        />
                        <span>{opt.label}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* AI Adoption */}
                <div>
                    <label className="font-semibold text-sky-900 mb-1 block">Implementazione strumenti di AI</label>
                    <div className="flex flex-col gap-2">
                    {aiOptions.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="ai"
                            value={opt.value}
                            checked={ai === opt.value}
                            onChange={() => setAi(opt.value)}
                        />
                        <span>{opt.label}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* Avanti */}
                <button
                    className="bg-teal-300 text-black font-bold px-6 py-3 rounded-xl disabled:opacity-40 transition mt-4 cursor-pointer"
                    disabled={!valido}
                    onClick={() => onNext?.({ dim, settore: settoreFinale, dig, ai })}
                >
                    Inizia il Checkup
                </button>
            </section>
        );
    }
