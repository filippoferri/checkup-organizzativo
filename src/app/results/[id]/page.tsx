// In /src/app/results/[id]/page.tsx
import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';
import ResultsView from '@/components/ResultsView';
import { CheckupResponse } from '@/components/AdminPanel';

// Inizializza la connessione al database
const sql = neon(process.env.DATABASE_URL!);

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  // Recupera l'ID dalla URL
  const { id } = await params;
  
  try {
    // Recupera i dati dal database usando l'ID
    const results = await sql`
      SELECT * FROM checkup_responses WHERE id = ${id} LIMIT 1
    `;
    
    // Se non ci sono risultati, mostra 404
    if (!results || results.length === 0) {
      return notFound();
    }
    
    // Passa i dati al componente di visualizzazione
    return <ResultsView data={results[0] as CheckupResponse} />;
  } catch (error) {
    console.error('Error fetching results:', error);
    return <div>Si è verificato un errore nel caricamento dei risultati.</div>;
  }
}