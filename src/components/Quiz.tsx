    "use client";
    import { useState } from "react";

    // Domande organizzate per area (puoi personalizzare i testi)
    const domande = [
        // Visione e Strategia (1-6)
        "Abbiamo una visione scritta e chiara che tutti i dipendenti conoscono e condividono.",
        "I nostri valori sono chiari e li usiamo per assumere, valutare e premiare le persone.",
        "Sappiamo esattamente qual è il nostro business principale e non ci dispersiamo in troppe attività diverse.",
        "Abbiamo obiettivi a 3-5 anni scritti e li comunichiamo regolarmente al team.",
        "Sappiamo chi è il nostro cliente ideale e puntiamo solo su quel tipo di clienti.",
        "Sappiamo cosa ci rende diversi dalla concorrenza e lo comunichiamo chiaramente.",
        
        // Organizzazione e Persone (7-13)
        "Tutte le persone che lavorano con noi condividono i nostri valori e si trovano bene nella nostra cultura aziendale.",
        "Ogni persona sa esattamente cosa deve fare, di cosa è responsabile e a chi deve rispondere.",
        "Ognuno è nel posto giusto: capisce il suo ruolo, gli piace quello che fa e sa farlo bene.",
        "I responsabili hanno obiettivi chiari da raggiungere ogni mese e li condividono con i loro collaboratori.",
        "Facciamo riunioni regolari (settimanali o mensili) con agenda chiara e rispettiamo i tempi.",
        "Se una persona chiave si ammala o va in ferie, l'azienda continua a funzionare senza problemi.",
        "Investiamo almeno 20 ore all'anno in formazione per ogni dipendente.",
        
        // Processi e Digitalizzazione (14-20)
        "I nostri processi principali sono scritti, semplici e tutti li seguono per ottenere sempre gli stessi buoni risultati.",
        "Chiediamo feedback ai clienti almeno ogni 6 mesi e ai dipendenti almeno una volta all'anno.",
        "Misuriamo e controlliamo almeno 3-5 numeri importanti dell'azienda ogni mese (vendite, costi, qualità, etc.).",
        "Usiamo strumenti digitali (gestionale, CRM, email, cloud) per semplificare il lavoro quotidiano.",
        "Abbiamo un budget scritto e lo controlliamo ogni mese per capire se stiamo spendendo troppo.",
        "Proteggiamo i nostri dati aziendali con password sicure, backup e antivirus aggiornati.",
        "Monitoriamo i costi principali ogni mese e sappiamo dove possiamo risparmiare se necessario.",
        
        // Innovazione e Adattabilità (21-25)
        "Quando c'è un problema, lo affrontiamo subito insieme per il bene dell'azienda, senza colpevolizzare nessuno.",
        "Riusciamo a cambiare velocemente prodotti, servizi o processi quando il mercato lo richiede.",
        "Dedichiamo tempo e soldi per migliorare continuamente quello che facciamo e come lo facciamo.",
        "Le informazioni importanti arrivano velocemente a tutti: nessuno rimane all'oscuro di decisioni che lo riguardano.",
        "Abbiamo un piano B se il nostro cliente principale o fornitore principale ci abbandonasse domani."
    ];

    const labels = [
    "Insufficiente",
    "Scarso",
    "Adeguato",
    "Buono",
    "Eccellente",
    ];

    export interface QuizRisposte {
    risposte: number[];
    }

    interface QuizProps {
    onNext: (data: QuizRisposte) => void;
    }

    export default function Quiz({ onNext }: QuizProps) {
    const [step, setStep] = useState(0); // da 0 a 23
    const [risposte, setRisposte] = useState<number[]>(Array(domande.length).fill(0));

    const setRisposta = (val: number) => {
        const updated = [...risposte];
        updated[step] = val;
        setRisposte(updated);
    };

    const handleNext = () => {
        if (step < domande.length - 1) {
        setStep(step + 1);
        } else {
        onNext({ risposte });
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const progress = ((step + 1) / domande.length) * 100;

    return (
        <section className="max-w-xl w-full bg-white p-8 flex flex-col gap-8 mt-4 rounded-2xl">
        <div className="w-full bg-[#EDE7E3] h-2 rounded mb-2">
            <div
            className="bg-teal-300 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
            />
        </div>
        <h3 className="text-xl font-bold text-sky-900 text-center mb-1">
            Domanda {step + 1}/25
        </h3>
        <p className="text-sky-900 text-center text-lg mb-4">
            {domande[step]}
        </p>
        <div className="flex justify-between gap-1">
            {[1, 2, 3, 4, 5].map((val, idx) => (
            <button
                key={val}
                className={`flex-1 px-2 py-3 rounded-xl font-bold transition cursor-pointer
                ${risposte[step] === val ? 'bg-teal-300 text-black' : 'bg-gray-100 text-sky-600 hover:bg-sky-800 hover:text-white'}`}
                onClick={() => setRisposta(val)}
                type="button"
            >
                <span className="block text-base">{val}</span>
                <span className="block text-xs mt-1">{labels[idx]}</span>
            </button>
            ))}
        </div>
        <div className="flex justify-between mt-6">
            <button
            type="button"
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl text-gray-400 font-bold border border-gray-600 disabled:opacity-30 cursor-pointer"
            >
            Indietro
            </button>
            <button
            type="button"
            onClick={handleNext}
            disabled={risposte[step] === 0}
            className="px-6 py-2 rounded-xl bg-teal-300 text-black font-bold disabled:opacity-30 cursor-pointer" 
            >
            {step === domande.length - 1 ? "Vedi risultati" : "Avanti"}
            </button>
        </div>
        </section>
    );
    }
