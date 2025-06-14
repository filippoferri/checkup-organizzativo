import { NextRequest, NextResponse } from "next/server";
import { neon } from '@neondatabase/serverless';
import { Resend } from 'resend';

// Initialize the sql query function with the database URL
const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const {
            email, name, azienda_dim, azienda_settore,
            azienda_digitalizzazione, azienda_ai,
            risposte, risultato
        } = data;

        console.log('Received data:', { email, name, azienda_dim, azienda_settore, azienda_digitalizzazione, azienda_ai, risultato });
        console.log('Database URL exists:', !!process.env.DATABASE_URL);
        console.log('Resend API key exists:', !!process.env.RESEND_API_KEY);

        // Use the 'sql' instance for the tagged template literal query
        console.log('Attempting to insert into database...');
        /* const dbResult = await sql`
            INSERT INTO checkup_responses (
            email, nome, azienda_dim, azienda_settore, azienda_digitalizzazione, azienda_ai, risposte, risultato
            ) VALUES (
                ${email}, 
                ${name}, 
                ${azienda_dim}, 
                ${azienda_settore}, 
                ${azienda_digitalizzazione}, 
                ${azienda_ai}, 
                ${risposte}, 
                ${risultato}
            )
        `;
        */

        const dbResult = await sql`
            INSERT INTO checkup_responses (
                email, nome, azienda_dim, azienda_settore, azienda_digitalizzazione, azienda_ai, risposte, risultato
            ) VALUES (
                ${email}, 
                ${name}, 
                ${azienda_dim}, 
                ${azienda_settore}, 
                ${azienda_digitalizzazione}, 
                ${azienda_ai}, 
                ${risposte}, 
                ${risultato}
            )
            RETURNING id
            `;

        const insertedId = dbResult[0]?.id;

        console.log('Database insertion successful:', dbResult);

    // Send email with results
    try {
        // Check if Resend API key is available
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY environment variable is not set');
            return NextResponse.json({ ok: true, message: 'Data saved but email service not configured' });
        }

        // Initialize Resend client
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        // Temporarily use delivered@resend.dev for all environments until domain issues are resolved
        const toEmail = process.env.NODE_ENV === 'production' ? email : 'delivered@resend.dev';
        // const toEmail = 'delivered@resend.dev';
        
        console.log('Sending email to:', toEmail);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Resend API Key exists:', !!process.env.RESEND_API_KEY);
        console.log('Resend API Key length:', process.env.RESEND_API_KEY?.length);
        
        const emailPayload = {
            from: 'Checkup Organizzativo <noreply@filippoferri.it>',
            to: [toEmail],
            subject: `${name}, ecco i risultati del tuo Checkup Organizzativo`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0c4a6e; text-align: center;">Risultati del Checkup Organizzativo</h1>
                    
                    <p>Ciao <strong>${name}</strong>,</p>
                    <p>Grazie per aver completato il Checkup Organizzativo! Ecco i tuoi risultati:</p>
                    
                    <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <h2 style="color: #0c4a6e; font-size: 2.5em; margin: 0;">${risultato}%</h2>
                        <p style="color: #0369a1; font-weight: bold;">Punteggio Complessivo</p>
                    </div>
                    
                    <h3 style="color: #0c4a6e;">Interpretazione del risultato:</h3>
                    <p>${risultato < 50 ? 'La tua organizzazione ha ampi margini di miglioramento. Concentrati sulle aree con i punteggi più bassi.' : risultato < 66 ? 'Hai una struttura di base, ma servono miglioramenti in più aree.' : risultato < 80 ? 'Struttura buona, ma ci sono ancora opportunità di crescita.' : 'Struttura organizzativa solida! Continua a migliorare e innovare.'}</p>
                    
                    <div style="margin: 20px 0; text-align: center;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/results/${insertedId}" style="background-color: #16697A; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                        Visualizza i Risultati Completi
                    </a>
                    </div>

                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #92400e; margin-top: 0;">Vuoi migliorare i tuoi processi e performance?</h3>
                        <p style="margin-bottom: 15px;">Prenota una consulenza gratuita per scoprire come ottimizzare la tua organizzazione.</p>
                        <a href="https://filippoferri.it/prenota-una-call/" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Prenota una Call Gratuita</a>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 0.9em; margin-top: 30px;">Questo è un messaggio automatico. Per qualsiasi domanda, puoi rispondere a questa email.</p>
                </div>
            `
        };
        
        console.log('Email payload prepared:', JSON.stringify(emailPayload, null, 2));
        
        const result = await resend.emails.send(emailPayload);
        
        console.log('Email sent result:', result);
        return NextResponse.json({ ok: true, message: 'Data saved and email sent successfully' });
    } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue even if email fails - we've already saved to the database
        return NextResponse.json({ ok: true, message: 'Data saved but email failed to send' });
    }
    } catch (error) {
        console.error('Error in /api/checkup POST:', error);
        return NextResponse.json({ ok: false, error: 'Failed to process request' }, { status: 500 });
    }
}

export async function GET() {
    const rows = await sql`SELECT * FROM checkup_responses ORDER BY data DESC`;
    return NextResponse.json(rows);
}
      
