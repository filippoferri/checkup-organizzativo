"use client";
  import { useCallback, useEffect, useRef, useState } from 'react';
  import { QuizRisposte } from "./Quiz";

  interface ResultsProps {
      quiz: QuizRisposte;
      onRestart: () => void;
      email: string; 
      name: string; 
      azienda_dim: string; 
      azienda_settore: string; 
      azienda_digitalizzazione: string; 
      azienda_ai: string; 
  }

  // Helper function to determine color and icon based on percentage
  const getSeverityProps = (percentage: number) => {
    if (percentage < 40) {
      return {
        bgColorClass: 'bg-red-500',
        textColorClass: 'text-white',
        haloColorClass: 'bg-red-200',
      };
    }
    if (percentage < 70) {
      return {
        bgColorClass: 'bg-orange-400',
        textColorClass: 'text-white',
        haloColorClass: 'bg-orange-200',
      };
    }
    if (percentage < 90) {
      return {
        bgColorClass: 'bg-yellow-400',
        textColorClass: 'text-white',
        haloColorClass: 'bg-yellow-200',
      };
    }
    return {
      bgColorClass: 'bg-green-500',
      textColorClass: 'text-white',
    };
  };

  // Mock dati benchmark settore/dimensione
  const BENCHMARK = {
      totale: 82, // media percentuale
      aree: [65, 72, 68, 75], // vision-org-proc-inn
  };
  const aree = [
      { nome: "Visione e Strategia", da: 0, a: 5, colore: "#004a70" },
      { nome: "Persone e Organizzazione", da: 6, a: 12, colore: "#004a70" },
      { nome: "Processi e Digitalizzazione", da: 13, a: 19, colore: "#004a70" },
      { nome: "Innovazione e Adattabilità", da: 20, a: 24, colore: "#004a70" },
  ];

  // Radar chart data with 8 points
  const radarAree = [
      { nome: "Visione", da: 0, a: 3, colore: "#16697A" },
      { nome: "Strategia", da: 4, a: 6, colore: "#16697A" },
      { nome: "Organizzazione", da: 7, a: 10, colore: "#489FB5" },
      { nome: "Persone", da: 11, a: 14, colore: "#489FB5" },
      { nome: "Processi", da: 15, a: 17, colore: "#82C0CC" },
      { nome: "Digitalizzazione", da: 18, a: 19, colore: "#82C0CC" },
      { nome: "Innovazione", da: 20, a: 21, colore: "#FFA62B" },
      { nome: "Adattabilità", da: 22, a: 23, colore: "#FFA62B" },
  ];

  // Simple SVG Radar Chart Component
  const RadarChart = ({ data, size = 300 }: { data: number[], size?: number }) => {
      // Aumentiamo i margini per dare più spazio alle etichette
      const margin = 50; // Margine aumentato per le etichette
      const svgSize = size + margin * 2;
      const center = svgSize / 2;
      const maxRadius = size / 2 - 10;
      const angleStep = (2 * Math.PI) / data.length;
      
      // Generate points for the radar chart
      const points = data.map((value, index) => {
          const angle = index * angleStep - Math.PI / 2; // Start from top
          const radius = (value / 100) * maxRadius;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return { x, y, value, angle, label: radarAree[index].nome };
      });
      
      // Create polygon path
      const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
      
      // Grid circles
      const gridCircles = [20, 40, 60, 80, 100].map(percent => {
          const radius = (percent / 100) * maxRadius;
          return (
              <circle
                  key={percent}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
              />
          );
      });
      
      // Grid lines
      const gridLines = points.map((point, index) => {
          const endX = center + maxRadius * Math.cos(point.angle);
          const endY = center + maxRadius * Math.sin(point.angle);
          return (
              <line
                  key={index}
                  x1={center}
                  y1={center}
                  x2={endX}
                  y2={endY}
                  stroke="#e5e7eb"
                  strokeWidth="1"
              />
          );
      });
      
      // Labels
      const labels = points.map((point, index) => {
          const labelRadius = maxRadius + 25; // Aumentato il raggio per le etichette
          const labelX = center + labelRadius * Math.cos(point.angle);
          const labelY = center + labelRadius * Math.sin(point.angle);
          
          // Calcola l'ancoraggio del testo in base alla posizione
          let textAnchor = "middle";
          if (Math.cos(point.angle) > 0.7) textAnchor = "start"; // Etichetta a destra
          else if (Math.cos(point.angle) < -0.7) textAnchor = "end"; // Etichetta a sinistra
          
          return (
              <text
                  key={index}
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-sky-900"
              >
                  {point.label}
              </text>
          );
      });
      
      return (
          <svg width="600" height={svgSize} className="mx-auto" viewBox={`0 0 ${svgSize} ${svgSize}`}>
              {gridCircles}
              {gridLines}
              <polygon
                  points={polygonPoints}
                  fill="rgba(22, 105, 122, 0.2)"
                  stroke="#89B1DD"
                  strokeWidth="2"
              />
              {points.map((point, index) => (
                  <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#004E9B"
                  />
              ))}
              {labels}
          </svg>
      );
  };

  function interpretazione(p: number) {
      if (p < 50) return "La tua organizzazione ha ampi margini di miglioramento. Concentrati sulle aree con i punteggi più bassi.";
      if (p < 66) return "Hai una struttura di base, ma servono miglioramenti in più aree.";
      if (p < 80) return "Struttura buona, ma ci sono ancora opportunità di crescita.";
      return "Struttura organizzativa solida! Continua a migliorare e innovare.";
  }

  // Mock suggerimenti. In futuro: personalizzali su risposte/aree deboli/preliminari
  function suggerimentiAvanzati(areaIdx: number, percent: number): string[] {
    // 0 = Visione e Strategia, 1 = Organizzazione e Persone, ecc.
    if (areaIdx === 0) { // Visione e Strategia
      if (percent <= 40) return [
        "Definisci chiaramente perché esiste la tua azienda e fissa 2-3 obiettivi concreti per i prossimi 3 mesi. Benefit: +25% di focus del team, -40% di progetti abbandonati.",
        "Concentrati su poche priorità importanti per non disperdere le energie del team. Benefit: +30% di velocità di esecuzione, -50% di sprechi di risorse."
      ];
      if (percent <= 70) return [
        "Assicurati che tutti i dipendenti conoscano e capiscano la direzione dell'azienda. Benefit: +35% di produttività, -60% di conflitti interni.",
        "Organizza incontri regolari ogni 3 mesi per verificare se stai raggiungendo gli obiettivi. Benefit: +40% di obiettivi raggiunti, correzioni rapide in 2-4 settimane."
      ];
      return [
        "Proteggi il tuo business dalla concorrenza e rafforza quello che ti rende unico. Benefit: +20% di margini, mantenimento quota di mercato per 2-3 anni.",
        "Pensa a strategie a lungo termine per rimanere sempre un passo avanti. Benefit: crescita costante del 15-20% annuo, vantaggio competitivo duraturo."
      ];
    }
    if (areaIdx === 1) { // Organizzazione e Persone
      if (percent <= 40) return [
        "Chiarisci chi fa cosa in azienda e organizza brevi riunioni quotidiane per migliorare la comunicazione. Benefit: -3 ore/settimana di tempo perso, -70% di malintesi.",
        "Individua le competenze che mancano al tuo team e valuta corsi di formazione (puoi ottenere anche contributi statali). Benefit: credito d'imposta fino al 50%, +25% di competenze in 6 mesi."
      ];
      if (percent <= 70) return [
        "Affianca le persone chiave con mentor esperti e crea momenti di confronto costruttivo. Benefit: +40% di crescita professionale, -50% di turnover delle figure chiave.",
        "Coinvolgi i dipendenti nelle decisioni e organizza sessioni per raccogliere le loro idee. Benefit: +60% di engagement, una nuova idea implementabile ogni 2 mesi.",
        "Introduci benefici per il benessere dei dipendenti e monitora il loro livello di soddisfazione. Benefit: -30% di assenze, +20% di produttività individuale."
      ];
      return [
        "Investi nel benessere delle persone e offri formazione continua anche online. Benefit: risparmio 40-60% sui costi formativi, formazione disponibile 24/7.",
        "Individua i dipendenti più motivati e rendili ambasciatori del cambiamento. Benefit: velocità di adozione nuove pratiche +80%, resistenza al cambiamento -90%."
      ];
    }
    if (areaIdx === 2) { // Processi e Digitalizzazione
      if (percent <= 40) return [
        "Disegna come funzionano i tuoi processi principali e individua dove perdi più tempo. Benefit: identificazione di 2-4 ore/giorno di tempo recuperabile, -20% tempi di processo.",
        "Scegli i miglioramenti più semplici da fare con maggior impatto e inizia a usare strumenti digitali di base. Benefit: ROI del 300% in 3-6 mesi, automazione del 30% delle attività ripetitive."
      ];
      if (percent <= 70) return [
        "Misura i tempi dei tuoi processi e scrivi procedure chiare per le attività ricorrenti. Benefit: -50% tempo di formazione nuovi dipendenti, riduzione errori dell'80%.",
        "Coinvolgi il team in piccoli miglioramenti continui e organizza sessioni per ottimizzare i flussi di lavoro. Benefit: 1-2 miglioramenti implementati al mese, +15% efficienza operativa."
      ];
      return [
        "Automatizza le attività ripetitive con strumenti semplici e monitora i risultati con grafici e report. Benefit: risparmio 8-12 ore/settimana per persona, -95% errori manuali.",
        "Applica il metodo 'pianifica-esegui-verifica-migliora' ai processi più importanti. Benefit: +25% qualità output, cicli di miglioramento ogni 4-6 settimane.",
        "Verifica di essere in regola con gli obblighi di legge per le aziende. Benefit: eviti sanzioni da €5.000-€50.000, tranquillità operativa garantita."
      ];
    }
    if (areaIdx === 3) { // Innovazione e Adattabilità
      if (percent <= 40) return [
        "Adotta un approccio flessibile: prova cose nuove, concentrati su risultati veloci e concreti. Benefit: +50% velocità di innovazione, primi risultati in 30-60 giorni.",
        "Supera la resistenza al cambiamento spiegando i vantaggi e mostrando i primi successi. Benefit: +70% accettazione cambiamenti, riduzione conflitti del 60%.",
        "Tieni conto dei grandi cambiamenti in corso: digitale, incentivi pubblici, nuove generazioni. Benefit: accesso a fondi fino a €500.000, vantaggio competitivo di 2-3 anni."
      ];
      if (percent <= 70) return [
        "Per ogni novità che introduci: prova, misura i risultati, impara e migliora. Benefit: +40% successo progetti innovativi, riduzione sprechi del 50%.",
        "Sfrutta gli incentivi pubblici disponibili e pianifica come far crescere le innovazioni di successo. Benefit: fino a 40% dei costi coperti dallo Stato, accelerazione crescita del 30%."
      ];
      return [
        "Valuta innovazioni strategiche e preparati ai trend del futuro come l'intelligenza artificiale. Benefit: +25% efficienza operativa, posizionamento tra i leader di mercato.",
        "Crea una cultura dove si impara continuamente dai successi e dagli errori. Benefit: +35% capacità di adattamento, resilienza aziendale +60%."
      ];
    }
    return [];
  }
              
  export default function Results({ 
      quiz, 
      email, 
      name, 
      azienda_dim, 
      azienda_settore, 
      azienda_digitalizzazione, 
      azienda_ai 
  }: ResultsProps) {
                  // Calcolo totale e aree
                  const totale = quiz.risposte.reduce((a, b) => a + b, 0);
                  const percentuale = Math.round((totale / (24 * 5)) * 100);
                  const punteggiAree = aree.map(ar => {
                      const areaTot = quiz.risposte.slice(ar.da, ar.a + 1).reduce((a, b) => a + b, 0);
                      const max = (ar.a - ar.da + 1) * 5;
                      return Math.round((areaTot / max) * 100);
                  });
                  
                  // Calculate radar chart data (8 points)
                  const radarData = radarAree.map(ar => {
                      const areaTot = quiz.risposte.slice(ar.da, ar.a + 1).reduce((a, b) => a + b, 0);
                      const max = (ar.a - ar.da + 1) * 5;
                      return Math.round((areaTot / max) * 100);
                  });

                  const overallSeverity = getSeverityProps(percentuale);
                  const hasSentResults = useRef(false);

                  // Stato per tracciare l'invio dell'email
                  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

                  // Funzione per inviare i risultati all'API
                  const sendResults = useCallback(async () => {
                      if (hasSentResults.current) return; // Evita invii multipli
                      hasSentResults.current = true;      
                      
                      // Aggiorna lo stato a 'sending'
                      setEmailStatus('sending');

                      try {
                          const response = await fetch("/api/checkup", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                  email,                      
                                  name,                       
                                  azienda_dim,                
                                  azienda_settore,
                                  azienda_digitalizzazione,
                                  azienda_ai,
                                  risposte: quiz.risposte, 
                                  risultato: percentuale    
                              })
                          });
                          
                          const data = await response.json();
                          console.log('API response:', data);
                          
                          if (response.ok) {
                              setEmailStatus('success');
                          } else {
                              console.error('API error:', data);
                              setEmailStatus('error');
                              hasSentResults.current = false; // Permette un nuovo tentativo
                          }
                      } catch (error) {
                          console.error("Failed to send results:", error);
                          setEmailStatus('error');
                          hasSentResults.current = false; // Resetta se fallisce per permettere un nuovo tentativo
                      }
                  }, [email, name, azienda_dim, azienda_settore, azienda_digitalizzazione, azienda_ai, quiz.risposte, percentuale]);

                  useEffect(() => {
                      // Invia i risultati quando il componente viene montato
                      sendResults();
                  }, [email, name, azienda_dim, azienda_settore, azienda_digitalizzazione, azienda_ai, quiz.risposte, percentuale, sendResults]); // L'array di dipendenze rimane per rieseguire se i dati cambiano significativamente

                  return (
                      <section className="max-w-4xl w-full bg-white p-8 flex flex-col gap-6 mt-4 rounded-2xl">
                      <h2 className="text-2xl font-bold text-sky-900 text-center">Risultati del Checkup</h2>
                      
                      {/* Overall percentage */}
                      <div className="text-center">
                        <div className={`inline-block rounded-full ${overallSeverity.haloColorClass} p-6`}>
                            <div className={`rounded-full ${overallSeverity.bgColorClass} text-white text-3xl font-bold p-8 w-32 h-32 flex items-center justify-center`}>
                            {percentuale}%
                            </div>
                        </div>
                      </div>
                      
                      {/* Interpretation */}
                      <div className="text-center text-sky-900 font-bold text-lg">
                          {interpretazione(percentuale)}
                      </div>

                                            {/* Email status notification */}
                                            {emailStatus === 'sending' && (
                          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                              <strong className="font-bold">Invio in corso... </strong>
                              <span className="block sm:inline">Stiamo inviando il risultato alla tua email.</span>
                          </div>
                      )}
                      {emailStatus === 'success' && (
                          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                              <span className="block sm:inline">Ti abbiamo inviato una email con il risultato del checkup.</span>
                          </div>
                      )}
                      {emailStatus === 'error' && (
                          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                              <strong className="font-bold">Attenzione! </strong>
                              <span className="block sm:inline">Non è stato possibile inviare l&apos;email con i risultati. </span>
                              <button 
                                  onClick={() => {
                                      hasSentResults.current = false;
                                      setEmailStatus('sending');
                                      sendResults();
                                  }}
                                  className="mt-2 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
                              >
                                  Riprova invio
                              </button>
                          </div>
                      )}

                      {/* Radar Chart */}
                      <div className="bg-gray-50 rounded-xl p-4 overflow-visible flex justify-center">
                          <RadarChart data={radarData} size={280} />
                      </div>
                      
                      {/* Suggerimenti personalizzati */}
                      <div className="mt-4">
                      <h2 className="text-2xl font-bold text-sky-900 text-center mb-4">Raccomandazioni</h2>
                      {aree.map((ar, idx) => (
                          <div key={ar.nome} className="mb-4">
                          <div className="font-bold text-lg" style={{ color: ar.colore }}>{ar.nome}</div>
                          <ul className="list-disc pl-5">
                              {suggerimentiAvanzati(idx, punteggiAree[idx]).map((s, sidx) => (
                              <li key={sidx}>{s}</li>
                              ))}
                          </ul>
                          </div>
                      ))}
                      </div>
                      
                      {/* Benchmark settore/dimensione (mock) */}
                      <div className="mt-2 p-4 bg-gray-100 rounded-xl">
                          <div className="text-sky-900 font-bold mb-1">Confronto con benchmark di settore</div>
                          <div className="text-sky-600">
                          <b>Tuo punteggio:</b> {percentuale}%<br />
                          <b>Media settore:</b> {BENCHMARK.totale}%
                          </div>
                      </div>

                      <div className="mt-2 p-6 bg-gray-100 rounded-xl text-center">
                          <div className="text-sky-900 font-bold mb-1 text-xl">Hai bisogno di aiuto?</div>
                          <div className="text-sky-600">
                            <a
                                href="https://filippoferri.it/prenota-una-call/"
                                className="bg-teal-300 text-black font-bold px-6 py-3 rounded-xl transition mt-4 mx-auto inline-block text-center hover:bg-teal-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Prenota un colloquio
                            </a>
                          </div>
                      </div>
                      
                      </section>
                  );
              }
