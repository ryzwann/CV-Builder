/**
 * Fungsionalitas Toggle Sidebar (Hanya di Desktop)
 */
function toggleSidebar() {
    const builder = document.getElementById('builder');
    const openBtn = document.getElementById('open-sidebar-btn');
    const formArea = document.getElementById('builder-form-area');

    const isCollapsed = builder.classList.toggle('sidebar-collapsed');
    
    // Tampilkan/Sembunyikan tombol buka sidebar & atur lebar form
    if (isCollapsed) {
        openBtn.style.display = 'flex';
        formArea.classList.remove('lg:col-span-2');
        formArea.classList.add('lg:col-span-3'); // Memperluas form area
    } else {
        openBtn.style.display = 'none';
        formArea.classList.remove('lg:col-span-3');
        formArea.classList.add('lg:col-span-2'); // Mengembalikan ke ukuran semula
    }
}

/**
 * Utility untuk menampilkan pesan pop-up
 * @param {string} msg Pesan yang akan ditampilkan.
 */
function showMessage(msg) {
    const box = document.getElementById('message-box');
    box.textContent = msg.replace('⚠️', '').replace('❌', '').replace('✅', '').replace('⏳', '').trim();
    box.style.opacity = 1;
    box.style.display = 'block';
    
    const isError = msg.includes('❌') || msg.includes('⚠️');
    const isSuccess = msg.includes('✅');
    
    if (isError) {
        box.style.backgroundColor = '#fee2e2'; 
        box.style.color = '#991b1b'; 
    } else if (isSuccess) {
        box.style.backgroundColor = '#d1fae5'; 
        box.style.color = '#065f46'; 
    } else {
        box.style.backgroundColor = '#dbeafe'; 
        box.style.color = '#1e40af'; 
    }

    setTimeout(() => {
        box.style.opacity = 0;
        setTimeout(() => box.style.display = 'none', 300); 
    }, 3000);
}

/**
 * Memulai mode CV Builder dari Landing Page
 */
/**
 * Memulai mode CV Builder dari Landing Page (dengan Loading Screen di awal)
 */
function startCV(){
    // 1. Sembunyikan Landing Page
    document.getElementById('landing').style.display = 'none';
    
    const loadingScreen = document.getElementById('loading-screen');
    const onboardingGuide = document.getElementById('onboarding-guide');
    
    // Pastikan elemen ditemukan
    if (!loadingScreen || !onboardingGuide) {
        document.getElementById('builder').style.display = 'block';
        goToStep(1);
        showMessage('⚠️ Loading screen atau Onboarding Guide tidak ditemukan, langsung masuk builder.');
        return;
    }
    
    // 2. Tampilkan Loading Screen
    loadingScreen.style.display = 'flex';

    // 3. Tunggu 3 detik, lalu alihkan ke Panduan 3 Langkah
    setTimeout(() => {
        // Sembunyikan Loading Screen
        loadingScreen.style.display = 'none';
        
        // Tampilkan Halaman Panduan 3 Langkah
        onboardingGuide.style.display = 'flex';
    }, 3000); // 3000 milidetik = 3 detik
}

function enterBuilder(){
    document.getElementById('onboarding-guide').style.display = 'none';
    document.getElementById('builder').style.display = 'block';
    goToStep(1);
}

function startLoadingTransition(){
    const loadingScreen = document.getElementById('loading-screen');
    const onboardingGuide = document.getElementById('onboarding-guide');
    
    // 1. Sembunyikan Halaman Panduan
    onboardingGuide.style.display = 'none';
    
    // 2. Tampilkan Loading Screen
    loadingScreen.style.display = 'flex';

    // 3. Tunggu 3 detik, lalu masuk ke Form Builder
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        
        // Panggil fungsi yang membawa ke form builder
        enterBuilder(); 
    }, 3000); // 3000 milidetik = 3 detik
}

let current = 1;
const totalSteps = 5; 

/**
 * Navigasi antar langkah (steps)
 * @param {number} n Nomor langkah yang dituju (1 sampai 5)
 */
function goToStep(n){
    if (n < 1 || n > totalSteps) return;

    current = n;
    
    for(let i=1;i<=totalSteps;i++){
        const stepContainer = document.getElementById('step-'+i);
        if(stepContainer) stepContainer.style.display = (i===n)?'block':'none';
        
        let primaryColor = '#00A5A5'; 
        try {
            primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || primaryColor;
        } catch (e) { /* ignore error in safe environment */ }
        
        // Update indikator progress bar (mobile)
        const stepIndicatorMobile = document.querySelector(`.progress .step[data-step="${i}"]`);
        if(stepIndicatorMobile) {
            stepIndicatorMobile.classList.remove('bg-violet-700', 'text-white', 'bg-green-500', 'bg-gray-200', 'text-gray-600');
            if (i === n) {
                stepIndicatorMobile.classList.add('text-white'); 
                stepIndicatorMobile.style.backgroundColor = primaryColor;
            } else if (i < n) {
                stepIndicatorMobile.classList.add('bg-green-500', 'text-white'); 
                stepIndicatorMobile.style.backgroundColor = '#10b981'; // Green for complete
            } else {
                stepIndicatorMobile.classList.add('bg-gray-200', 'text-gray-600'); 
                stepIndicatorMobile.style.backgroundColor = '';
            }
        }

        // Update indikator sidebar (desktop)
        const sidebarItem = document.querySelector(`#step-navigation .sidebar-item[data-step="${i}"]`);
        if (sidebarItem) {
            sidebarItem.classList.remove('active');
            if (i === n) {
                sidebarItem.classList.add('active');
                sidebarItem.style.backgroundColor = primaryColor;
            } else {
                 sidebarItem.style.backgroundColor = '';
            }
        }
    }
    
    // Perbarui preview setiap kali pindah langkah
    renderPreview(); 

    // Gulir ke atas di perangkat seluler
    if (window.innerWidth < 1024) {
        window.scrollTo({top:0,behavior:'smooth'});
    }
}

/**
 * Lanjut ke langkah berikutnya (dengan validasi di Step 1).
 * @param {number} from Langkah saat ini
 */
// Di dalam fungsi nextStep(from) di script.js
function nextStep(from){
    // Hapus logic lama di sini (jika ada)
    
    if(from===1){
        // 1. Validasi (pertahankan jika ada)
        const name = document.getElementById('name').value.trim();
        const title = document.getElementById('title')?.value.trim();
        if(!name || !title){ 
            showMessage('⚠️ Nama lengkap dan Profesi wajib diisi di Step 1.'); 
            return; 
        }

        // 2. Tampilkan Interstitial Screen sebagai ganti nextStep(2)
        document.getElementById('interstitial-step2').style.display = 'flex';
        return; // Hentikan fungsi di sini
    }
    
    // Logic lama: jika bukan Step 1, lanjutkan seperti biasa
    if(from < totalSteps) goToStep(from+1);
}

/**
 * Kembali ke langkah sebelumnya.
 * @param {number} from Langkah saat ini
 */
function prevStep(from){ 
    if(from>1) goToStep(from-1); 
}

// --- dynamic fields for steps 3 & 4 (Baru: Lebih Terstruktur) ---

/**
 * Menambahkan baris input dinamis untuk Pengalaman Kerja (Job Title, Company, Date, Description)
 */
/**
 * Menambahkan baris input dinamis untuk Pengalaman Kerja (Job Title, Company, Date, Description)
 */
/**
 * Menambahkan baris input dinamis untuk Pengalaman Kerja
 */
function addExperience(){
    // Menggunakan ID 'exp-list' karena ini yang ada di HTML Anda (Step 3)
    const c = document.getElementById('exp-list'); 
    const index = c.children.length; 
    const descId = `exp-desc-${index}`; // ID unik untuk textarea deskripsi

    const row = document.createElement('div'); 
    // Tambah relative dan p-4 untuk styling container agar tombol Hapus bisa diposisikan di sudut
    row.className = 'dynamic-row experience-entry space-y-3 p-4 border rounded-lg shadow-sm bg-white relative'; 

    row.innerHTML = `
        <div class="grid md:grid-cols-2 gap-3">
            <input id="exp-title-${index}" type="text" placeholder="Jabatan/Posisi (Contoh: Desainer Senior)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
            <input id="exp-time-${index}" type="text" placeholder="Tahun (Contoh: 2020 - 2022)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
        </div>
        <input id="exp-company-${index}" type="text" placeholder="Nama Perusahaan" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
        
        <div class="relative">
            <button 
                type="button" 
                class="absolute top-1 right-1 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-lg transition z-10"
                onclick="exchangeWithAI('${descId}')"
            >
                <i class="fas fa-magic mr-1"></i> Enhance with AI
            </button>
            <textarea 
                id="${descId}" 
                placeholder="Deskripsi Singkat / 3-5 Bullet Point Pencapaian. Pisahkan setiap poin dengan baris baru." 
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition min-h-[100px] pt-10" 
                oninput="renderPreview()"
            ></textarea>
        </div>
        <button onclick="this.closest('.dynamic-row').remove(); renderPreview();" type="button" class="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition mt-2">Hapus Pengalaman</button>
    `;
    
    c.appendChild(row);
    renderPreview();
}

// Fungsi ini harus ditambahkan di bawah fungsi lain di script.js
async function exchangeWithAI(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    const rawText = textarea.value.trim();
    if (!rawText) {
        showMessage('⚠️ Harap isi teks terlebih dahulu.');
        return;
    }

    showMessage('⏳ Mengirim ke Vercel AI Service...');
    textarea.disabled = true;

    try {
        // Panggilan ke Vercel API Endpoint yang baru dibuat
        const response = await fetch('/api/optimize-cv', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cvText: rawText })
        });
        
        const data = await response.json();

        if (response.ok && data.status === 'success') {
            textarea.value = data.optimizedText.trim();
            showMessage('✅ Optimasi AI selesai! Hasil diterapkan.');
        } else {
            // Tangani error dari server Vercel atau gunakan simulasi jika gagal
            showMessage('❌ Gagal: ' + (data.message || data.error || 'Server error.'));
            
            // Fallback simulasi untuk memastikan aplikasi tidak rusak saat pengujian
             const demoText = `
- [Simulasi Vercel Error]: Optimasi konten tidak tersedia saat ini.
- Menjalankan 50% lebih cepat dari estimasi, menghemat waktu dan biaya.
            `;
            textarea.value = demoText.trim();
        }

    } catch (error) {
        showMessage('❌ Error koneksi: Server Vercel/Netlify tidak ditemukan.');
        
        // Fallback simulasi
        const demoText = `
- [Simulasi Koneksi Error]: Mohon coba kembali setelah deployment Vercel selesai.
- Implementasi fungsional untuk pengujian.
        `;
        textarea.value = demoText.trim();
        
    } finally {
        textarea.disabled = false;
        renderPreview();
    }
}

/**
 * Menambahkan baris input dinamis untuk Riwayat Pendidikan (Degree, Institution, Date, Notes)
 */
function addEducation(){
    const c = document.getElementById('edu-list');
    const index = c.children.length; 
    const row = document.createElement('div'); 
    row.className = 'dynamic-row space-y-3';
    
    row.innerHTML = `
        <div class="grid md:grid-cols-2 gap-3">
            <input id="edu-degree-${index}" type="text" placeholder="Gelar/Jenjang (Contoh: S1 Seni Rupa)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
            <input id="edu-time-${index}" type="text" placeholder="Tahun (Contoh: 2014 - 2016)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
        </div>
        <input id="edu-inst-${index}" type="text" placeholder="Nama Institusi/Universitas (Contoh: Sekolah Umum)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
        <input id="edu-notes-${index}" type="text" placeholder="Opsional: Lokasi atau Deskripsi Singkat (Contoh: 123 Anywhere St, City)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-600 focus:border-teal-600 transition" oninput="renderPreview()">
        <button onclick="this.parentNode.remove(); renderPreview();" type="button" class="muted-btn absolute top-3 right-3 text-red-600 text-sm p-1 rounded hover:bg-red-200">Hapus</button>
    `;
    
    c.appendChild(row);
    renderPreview();
}


// --- helper functions (Mendukung Template Pro) ---

function escapeHtml(s){ 
    if (s === null || s === undefined) return '';
    return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

/**
 * Mengumpulkan semua data dari formulir. (Menggunakan struktur field baru)
 */
/**
 * Mengumpulkan semua data dari formulir.
 * Fungsi ini membaca semua field input dari Step 1 hingga Step 5 dengan aman.
 */
function collectData(){
    // --- 1. Ambil Data Pengalaman Kerja (Dynamic Fields) ---
    const expList = [];
    document.querySelectorAll('#exp-list > .dynamic-row').forEach((row, index) => {
        // Menggunakan ?.value.trim() || '' untuk membaca data dengan aman
        const title = document.getElementById(`exp-title-${index}`)?.value.trim() || '';
        const compTime = document.getElementById(`exp-time-${index}`)?.value.trim() || '';
        const company = document.getElementById(`exp-company-${index}`)?.value.trim() || '';
        const desc = document.getElementById(`exp-desc-${index}`)?.value.trim() || '';
        
        // Kumpulkan data meskipun hanya sebagian yang terisi
        if (title || compTime || company || desc) { 
            expList.push({
                title: title,
                compTime,
                company,
                description: desc.split('\n').map(d=>d.trim()).filter(Boolean)
            });
        }
    });

    // --- 2. Ambil Data Pendidikan (Dynamic Fields) ---
    const eduList = [];
    document.querySelectorAll('#edu-list > .dynamic-row').forEach((row, index) => {
        const degree = document.getElementById(`edu-degree-${index}`)?.value.trim() || '';
        const time = document.getElementById(`edu-time-${index}`)?.value.trim() || '';
        const institution = document.getElementById(`edu-inst-${index}`)?.value.trim() || '';
        const notes = document.getElementById(`edu-notes-${index}`)?.value.trim() || '';
        
        if (degree || time || institution || notes) { // Kumpulkan data yang relevan
            eduList.push({ degree, time, institution, notes });
        }
    });

    // --- 3. Ambil Data Keahlian (Skills) ---
    const rawSkills = document.getElementById('skills')?.value || '';
    const skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
    const hardcodedSkills = [
        'Desain Grafis', 'Kreatif', 'Editor Video', 'Membuat Konten', 'Pemasaran'
    ];
    const finalSkills = skills.length > 0 ? skills.slice(0, 5) : hardcodedSkills.slice(0, 5);
    
    // Memberikan rating (untuk preview)
    const skillRatings = finalSkills.map((s, i) => {
        const stars = [5, 4, 5, 4, 5];
        return { name: s, rating: stars[i % 5] };
    });

    // --- 4. Ambil Data Bahasa (Languages) ---
    const rawLanguages = document.getElementById('languages')?.value || '';
    const languages = rawLanguages.split(',').map(l => l.trim()).filter(Boolean);

    // --- 5. RETURN DATA LENGKAP ---
    return {
        // Step 1: Data Diri & Kontak
        name: document.getElementById('name')?.value.trim() || '',
        title: document.getElementById('title')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        phone: document.getElementById('phone')?.value.trim() || '',
        address: document.getElementById('address')?.value.trim() || '',
        
        // Step 2: Summary
        summary: document.getElementById('summary')?.value.trim() || '',
        
        // Dynamic Sections
        experiences: expList,
        educations: eduList,
        
        // Static Sections
        skills: skillRatings,
        languages: languages, 
        
        // Utility
        template: 'ats-clean', // Ganti ke class ATS baru
        premium: document.getElementById('noWatermark')?.checked || false
    }
}

/**
 * Merender CV ke panel preview di sisi kanan (Menggunakan Template Modern Pro).
 */
function renderPreview(){
    const d = collectData();
    const box = document.getElementById('cv-preview');
    let html = '';

    // 1. Validasi Minimum
    if (!d.name || !d.title) {
        box.innerHTML = '<p class="hint text-center text-gray-400">Isi data di formulir sebelah kiri untuk melihat pratinjau CV Anda di sini.</p>';
        document.getElementById('watermark').style.display = 'none';
        return;
    }

    // 2. Helper Render Experience (Dibuat Kolom Ganda)
    const expToHtml = (exps) => {
        // Logika untuk membagi data menjadi dua kolom (50/50)
        const half = Math.ceil(exps.length / 2);
        const col1 = exps.slice(0, half);
        const col2 = exps.slice(half);

        const renderCol = (items) => {
            return items.map(exp => `
                <div class="item">
                    <span class="item-subtitle">${escapeHtml(exp.compTime)}</span>
                    <span class="item-title" style="color: var(--primary-dark);">${escapeHtml(exp.title)}</span>
                    <ul style="margin-top: 3px;">
                    ${exp.description.map(desc=>'<li>'+escapeHtml(desc)+'</li>').join('')}
                    </ul> 
                </div>
            `).join('');
        };

        return {
            col1: `<div>${renderCol(col1)}</div>`,
            col2: `<div>${renderCol(col2)}</div>`
        };
    };

    // 3. Helper Render Education (Dibuat Kolom Ganda)
    const eduToHtml = (edus) => {
        // Logika untuk membagi data menjadi dua kolom (50/50)
        const half = Math.ceil(edus.length / 2);
        const col1 = edus.slice(0, half);
        const col2 = edus.slice(half);

        const renderCol = (items) => {
            return items.map(edu => `
                <div class="item">
                    <span class="item-subtitle">${escapeHtml(edu.time)}</span>
                    <span class="item-title" style="color: var(--primary-dark);">${escapeHtml(edu.degree)}</span>
                    <span class="text-xs font-normal text-gray-600">${escapeHtml(edu.institution)}</span>
                </div>
            `).join('');
        };

        return {
            col1: `<div>${renderCol(col1)}</div>`,
            col2: `<div>${renderCol(col2)}</div>`
        };
    };

    // 4. Helper Render Skills with Rating
    const skillToHtml = (skills) => {
        return skills.map(skill => {
            const filledStars = '★'.repeat(skill.rating);
            const emptyStars = '★'.repeat(5 - skill.rating);
            return `
                <div class="text-gray-700">
                    <span>${escapeHtml(skill.name)}</span>
                    <span style="color: var(--primary-dark);" class="text-sm">
                        <span style="color: var(--primary-color);">${filledStars}</span>
                        <span style="color: #ccc;">${emptyStars}</span>
                    </span>
                </div>
            `;
        }).join('');
    };

    // 5. Helper Render Languages (Dengan Progress Bar)
    const langToHtml = (langs) => {
         
         const finalLanguages = langs.slice(0, 3); // Ambil 3 bahasa teratas
         
         return finalLanguages.map(lang => {
            // Coba ekstrak level dari kurung
            const match = lang.match(/\((.*?)\)/); 
            const level = match ? match[1].trim() : 'Basic';
            const name = match ? lang.replace(match[0], '').trim() : lang;
            
            let percent;
            if (level.includes('Native')) percent = 100;
            else if (level.includes('Advanced')) percent = 90;
            else if (level.includes('Intermediate')) percent = 65;
            else percent = 40;

            return `
                <div style="margin-bottom: 5px;">
                    <p class="text-xs font-semibold">${escapeHtml(name)}</p>
                    <div style="height: 5px; background: #e0f2f2; border-radius: 3px; overflow: hidden; margin-top: 2px;">
                        <div style="width: ${percent}%; height: 100%; background: var(--primary-color);"></div>
                    </div>
                </div>
            `;
         }).join('');
    };


    // 6. Render Template HTML Utama
    box.classList.remove('cv-modern');
    box.classList.add('cv-modern-pro');
    
    const renderedExp = expToHtml(d.experiences);
    const renderedEdu = eduToHtml(d.educations);

    html = `
        <div class="cv-modern-pro">
            
            <div class="small-accent-wave"></div>

            <div class="profile-pic-container">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>

            <div class="header-area">
                <div class="header-content">
                    <h1>${escapeHtml(d.name).toUpperCase() || 'NAMA LENGKAP'}</h1>
                    <h2>${escapeHtml(d.title).toUpperCase() || 'JABATAN PROFESIONAL'}</h2>
                </div>
            </div>

            <div class="body-area">
                
                <div class="left-column">
                     ${d.summary ? `
                        <div class="section">
                            <div class="section-title">Tentang Saya</div>
                            <p style="text-align: justify; font-size: 9pt; line-height: 1.4; margin-top: 5px;">${escapeHtml(d.summary)}</p>
                        </div>
                    ` : ''}

                    <div class="section">
                        <div class="section-title">Pengalaman Kerja</div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap: 10px;">
                            ${renderedExp.col1}
                            ${renderedExp.col2}
                        </div>
                    </div>
                     
                    <div class="section">
                        <div class="section-title">Pendidikan</div>
                         <div style="display:grid; grid-template-columns:1fr 1fr; gap: 10px;">
                            ${renderedEdu.col1}
                            ${renderedEdu.col2}
                        </div>
                    </div>
                    
                    ${d.skills.length > 0 ? `
                        <div class="section">
                            <div class="section-title">Keahlian</div>
                            <div class="skills-list">
                                ${skillToHtml(d.skills)}
                            </div>
                        </div>
                    ` : ''}
                    
                </div>
                
                <div class="right-column">
                    
                    <div class="section">
                        <div class="section-title">Kontak Saya</div>
                        <div style="margin-top: 5px; line-height: 1.4;">
                            ${d.phone ? '<p class="text-xs font-normal text-gray-700"><strong>Telp:</strong> ' + escapeHtml(d.phone) + '</p>' : ''}
                            ${d.email ? '<p class="text-xs font-normal text-gray-700"><strong>Email:</strong> ' + escapeHtml(d.email) + '</p>' : ''}
                            ${d.address ? '<p class="text-xs font-normal text-gray-700"><strong>Alamat:</strong> ' + escapeHtml(d.address) + '</p>' : ''}
                        </div>
                    </div>

                     ${d.languages.length > 0 ? `
                        <div class="section">
                            <div class="section-title">Bahasa</div>
                            <div style="margin-top: 5px;">
                                 ${langToHtml(d.languages)}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
    
    box.innerHTML = html;

    // Watermark Logic
    const wm = document.getElementById('watermark');
    wm.style.display = d.premium ? 'none' : 'block';
}

/**
 * Menambahkan listener ke semua input untuk Live Preview.
 */
function attachLiveListeners() {
    // Listener untuk input teks (perubahan instan)
    const textInputs = document.querySelectorAll('#builder input:not([type="checkbox"]), #builder textarea');
    textInputs.forEach(input => {
        input.addEventListener('input', renderPreview);
    });
    // Listener untuk checkbox (perubahan premium)
    document.getElementById('noWatermark')?.addEventListener('change', renderPreview);
    
    // Inisialisasi awal preview
    renderPreview();
}

// Init: Menambahkan satu baris default dan mengaktifkan live listeners.
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi satu baris input dinamis (menggunakan Step 3 & 4 containers)
    addEducation(); 
    addExperience();
    
    // Lampirkan listener ke semua input
    attachLiveListeners();
});

// --- PDF download ---
function downloadPDF(){
    renderPreview(); 
    
    const d = collectData();
    const element = document.getElementById('cv-preview');
    const wm = document.getElementById('watermark');
    
    if (!d.name || !d.title) {
        showMessage('❌ Gagal mengunduh. Mohon lengkapi Step 1 (Nama & Profesi) terlebih dahulu.');
        return;
    }
    
    // Sembunyikan watermark sementara untuk PDF
    const prevWmDisplay = wm.style.display;
    wm.style.display = 'none';

    showMessage('⏳ Mempersiapkan CV untuk diunduh. Harap tunggu sebentar...');

    const opt = {
        margin: 0, 
        filename: (d.name? d.name.replaceAll(' ','_') : 'CV_Otomatis') + '.pdf',
        image: { type: 'jpeg', quality: 0.97 },
        html2canvas: { scale: 3, useCORS: true }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
        html2pdf().set(opt).from(element).save().then(()=>{
            wm.style.display = prevWmDisplay; 
            showMessage('✅ CV berhasil diunduh sebagai PDF!');
        }).catch(err=>{
            console.error('Download Error:', err);
            showMessage('❌ Gagal mengunduh CV. Cek konsol untuk detail error.');
            wm.style.display = prevWmDisplay; 
        });
    }, 100); 
}

// Di script.js
function proceedToStep(n) {
    // Sembunyikan Interstitial Screen
    document.getElementById('interstitial-step2').style.display = 'none';
    
    // Lanjutkan ke langkah yang dituju (yaitu Step 2)
    goToStep(n);
}

function exitInterstitial(n) {
    // Sembunyikan Interstitial Screen
    document.getElementById('interstitial-step2').style.display = 'none';
    
    // Kembali ke langkah sebelumnya (yaitu Step 1)
    goToStep(n);
}