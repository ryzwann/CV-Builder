import { GoogleGenAI } from '@google/genai';

// API Key akan diambil dari Environment Variables Vercel (AMAN!)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = "gemini-2.5-flash"; 

export default async function (req, res) {
    // 1. Cek Metode dan Konten
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
    const { cvText } = req.body;

    if (!cvText) {
        return res.status(400).json({ error: "Teks CV tidak boleh kosong." });
    }

    const SYSTEM_INSTRUCTION = `Anda adalah ahli optimasi CV dan ATS. Ubah paragraf pengalaman berikut menjadi 3-5 poin pencapaian kuat dan terukur. Fokus pada hasil/dampak, gunakan kata kerja aksi yang kuat. Hasil harus dalam Bahasa Indonesia.`;
    
    const prompt = `Pengalaman kerja yang harus dioptimalkan:\n${cvText}`;

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7, 
            }
        });

        const optimizedText = result.text.trim();

        // 2. Kirim respons sukses ke frontend
        return res.status(200).json({ 
            status: 'success',
            optimizedText: optimizedText 
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ 
            status: 'error',
            message: 'Gagal memproses AI. Cek konfigurasi API Key.' 
        });
    }
}