const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");


menuToggle.addEventListener("click", function () {
    const menuTerbuka = navLinks.classList.toggle("menu-buka");

    menuToggle.setAttribute("aria-expanded", menuTerbuka);
    menuToggle.textContent = menuTerbuka ? "✕" : "☰";
});
        function sapaAku() {
            const pesan = document.getElementById("pesan");
            pesan.textContent = "Selamat datang di website pertama aku!";
            pesan.classList.add("pesan-muncul");
        }


// NAVBAR ACTIVE LINK
const semuaLinkNavbar = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

const semuaSection = document.querySelectorAll(
    '#home, #about, #projects, #contact'
);

function updateNavbarAktif() {
    let sectionAktif = 'home';

    semuaSection.forEach(function (section) {
        const posisiAtas = section.getBoundingClientRect().top;

        if (posisiAtas <= 150) {
            sectionAktif = section.id;
        }
    });

    semuaLinkNavbar.forEach(function (link) {
        const tujuan = link.getAttribute('href');

        link.classList.toggle(
            'active',
            tujuan === '#' + sectionAktif
        );
    });
}

window.addEventListener('scroll', updateNavbarAktif);
window.addEventListener('load', updateNavbarAktif);


// STAGGER SCROLL REVEAL
const elemenReveal = document.querySelectorAll(
    '.section-card.reveal, .project-item'
);

if ('IntersectionObserver' in window) {
    const pengamat = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('muncul');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    elemenReveal.forEach(function (elemen) {
        elemen.classList.add('reveal');
        pengamat.observe(elemen);
    });
} else {
    elemenReveal.forEach(function (elemen) {
        elemen.classList.add('reveal', 'muncul');
    });
}


// TYPEWRITER EFFECT
const teksMengetik = document.getElementById("teks-mengetik");

const daftarTeks = [
    "Halo, temen temen!",
    "Aku abil.",
    "Calon Developer!",
    "Welcome to My Website."
];

let indeksTeks = 0;
let indeksHuruf = 0;
let sedangMenghapus = false;

function efekMengetik() {
    const teksSekarang = daftarTeks[indeksTeks];

    if (sedangMenghapus) {
        indeksHuruf--;
    } else {
        indeksHuruf++;
    }

    teksMengetik.textContent = teksSekarang.substring(
        0,
        indeksHuruf
    );

    let kecepatan = sedangMenghapus ? 45 : 90;

    if (!sedangMenghapus && indeksHuruf === teksSekarang.length) {
        sedangMenghapus = true;
        kecepatan = 1300;
    } else if (sedangMenghapus && indeksHuruf === 0) {
        sedangMenghapus = false;

        indeksTeks++;

        if (indeksTeks >= daftarTeks.length) {
            indeksTeks = 0;
        }

        kecepatan = 400;
    }

    setTimeout(efekMengetik, kecepatan);
}

if (
    teksMengetik &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
    efekMengetik();
}

// ===================================
// INTERACTIVE PURPLE PARTICLES
// ===================================

(function () {
    const canvas = document.getElementById("particle-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const kurangiAnimasi = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let lebar = 0;
    let tinggi = 0;
    let partikel = [];
    let frameId = null;

    const mouse = {
        x: -1000,
        y: -1000,
        aktif: false
    };

    // Ukuran canvas dan jumlah partikel
    function aturCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        lebar = window.innerWidth;
        tinggi = window.innerHeight;

        canvas.width = Math.round(lebar * dpr);
        canvas.height = Math.round(tinggi * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Batasi jumlah agar tetap ringan
        const jumlah = lebar < 600 ? 22 : 42;

        partikel = [];

        for (let i = 0; i < jumlah; i++) {
            partikel.push({
                x: Math.random() * lebar,
                y: Math.random() * tinggi,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.25
            });
        }

        gambarPartikel();
    }

    // Menggambar titik-titik ungu
    function gambarPartikel() {
        ctx.clearRect(0, 0, lebar, tinggi);

        // Cahaya lembut di sekitar mouse
        if (mouse.aktif && !kurangiAnimasi) {
            const cahaya = ctx.createRadialGradient(
                mouse.x, mouse.y, 0,
                mouse.x, mouse.y, 160
            );

            cahaya.addColorStop(0, "rgba(168, 85, 247, 0.12)");
            cahaya.addColorStop(1, "rgba(168, 85, 247, 0)");

            ctx.fillStyle = cahaya;
            ctx.fillRect(0, 0, lebar, tinggi);
        }

        partikel.forEach(function (p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            ctx.fillStyle = `rgba(196, 181, 253, ${p.alpha})`;
            ctx.fill();
        });
    }

    // Menggerakkan partikel
    function gerakkanPartikel() {
        partikel.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;

            // Pantulkan partikel di tepi layar
            if (p.x < 0 || p.x > lebar) p.vx *= -1;
            if (p.y < 0 || p.y > tinggi) p.vy *= -1;

            // Mouse mendorong partikel di dekatnya
            if (mouse.aktif && !kurangiAnimasi) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const jarak = Math.sqrt(dx * dx + dy * dy);

                if (jarak < 120 && jarak > 0) {
                    const kekuatan = (120 - jarak) / 120 * 0.45;

                    p.x += (dx / jarak) * kekuatan;
                    p.y += (dy / jarak) * kekuatan;
                }
            }
        });
    }

    // Animasi utama
    function animasi() {
        frameId = null;

        if (document.hidden) return;

        gerakkanPartikel();
        gambarPartikel();

        frameId = requestAnimationFrame(animasi);
    }

    // Ikuti posisi mouse
    window.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") return;

        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.aktif = true;
    }, { passive: true });

    window.addEventListener("pointerout", function (event) {
        if (!event.relatedTarget) {
            mouse.aktif = false;
        }
    });

    // Sesuaikan saat ukuran jendela berubah
    window.addEventListener("resize", aturCanvas);

    // Hemat sumber daya ketika tab tidak dibuka
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
                frameId = null;
            }
        } else if (frameId === null && !kurangiAnimasi) {
            frameId = requestAnimationFrame(animasi);
        }
    });

    aturCanvas();

    if (!kurangiAnimasi) {
        frameId = requestAnimationFrame(animasi);
    }
})();


// ===================================
// MAGNETIC HOVER — PURPLE GLOW
// ===================================

const elemenMagnetic = document.querySelectorAll(
    ".card, .section-card, .project-item, .tombol-project, .contact-link"
);

const mendukungHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

const mengurangiAnimasi = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (mendukungHover && !mengurangiAnimasi) {
    elemenMagnetic.forEach(function (elemen) {
        elemen.classList.add("magnetic");

        elemen.addEventListener("pointermove", function (event) {
            const posisi = elemen.getBoundingClientRect();

            const x = event.clientX - posisi.left;
            const y = event.clientY - posisi.top;

            const tengahX = posisi.width / 2;
            const tengahY = posisi.height / 2;

            const gerakX = (x - tengahX) / tengahX;
            const gerakY = (y - tengahY) / tengahY;

            elemen.style.transform =
                `translate(${gerakX * 4}px, ${gerakY * 4}px)`;
        });

        elemen.addEventListener("pointerleave", function () {
            elemen.style.transform = "";
        });
    });
}

// 
//CUSTOM CURSOR GLOW — PURPLE
// 

(function () {
    const dukungMouse = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const kurangiAnimasi = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!dukungMouse || kurangiAnimasi) return;

    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

    let posisiX = 0;
    let posisiY = 0;
    let frameId = null;

    function gerakkanCursor() {
        cursor.style.left = posisiX + "px";
        cursor.style.top = posisiY + "px";
        frameId = null;
    }

    window.addEventListener("pointermove", function (event) {
        if (event.pointerType === "touch") return;

        posisiX = event.clientX;
        posisiY = event.clientY;

        cursor.classList.add("aktif");

        if (frameId === null) {
            frameId = requestAnimationFrame(gerakkanCursor);
        }
    }, { passive: true });

    document.addEventListener("pointerover", function (event) {
        if (event.pointerType === "touch") return;

        const target = event.target;

        if (target.closest("a, button, .magnetic")) {
            cursor.classList.add("membesar");
        } else {
            cursor.classList.remove("membesar");
        }
    });

    document.addEventListener("pointerleave", function () {
        cursor.classList.remove("aktif", "membesar");
    });

    document.addEventListener("pointerenter", function () {
        if (posisiX !== 0 || posisiY !== 0) {
            cursor.classList.add("aktif");
        }
    });
})();


// SCROLL PROGRESS BAR — PURPLE

(function () {
    const progressBar = document.querySelector(
        ".scroll-progress-bar"
    );

    if (!progressBar) return;

    let frameId = null;

    function perbaruiProgress() {
        frameId = null;

        const posisiScroll =
            window.scrollY || document.documentElement.scrollTop;

        const tinggiDokumen =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const progress = tinggiDokumen > 0
            ? Math.min(100, Math.max(0,
                (posisiScroll / tinggiDokumen) * 100
            ))
            : 0;

        progressBar.style.width = progress + "%";
    }

    function jadwalkanUpdate() {
        if (frameId === null) {
            frameId = requestAnimationFrame(perbaruiProgress);
        }
    }

    window.addEventListener("scroll", jadwalkanUpdate, {
        passive: true
    });

    window.addEventListener("resize", jadwalkanUpdate, {
        passive: true
    });

    perbaruiProgress();
})();



// CARD SPOTLIGHT — PURPLE


(function () {
    const kartu = document.querySelectorAll(
        ".section-card, .project-item"
    );

    const dukungMouse = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const kurangiAnimasi = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!dukungMouse || kurangiAnimasi) return;

    kartu.forEach(function (elemen) {
        elemen.addEventListener("pointermove", function (event) {
            const posisi = elemen.getBoundingClientRect();

            const x = event.clientX - posisi.left;
            const y = event.clientY - posisi.top;

            elemen.style.setProperty("--spot-x", x + "px");
            elemen.style.setProperty("--spot-y", y + "px");
        }, { passive: true });
    });
})();



// DARK / LIGHT MODE TOGGLE


(function () {
    const tombolTema = document.getElementById("theme-toggle");
    const ikonTema = document.getElementById("theme-icon");

    if (!tombolTema || !ikonTema) return;

    function aturTema(tema) {
        document.documentElement.dataset.theme = tema;

        const temaTerang = tema === "light";

        ikonTema.textContent = temaTerang ? "🌙" : "☀️";

        tombolTema.setAttribute(
            "aria-label",
            temaTerang ? "Ganti ke tema gelap" : "Ganti ke tema terang"
        );
    }

    tombolTema.addEventListener("click", function () {
        const temaSekarang =
            document.documentElement.dataset.theme || "dark";

        const temaBaru = temaSekarang === "dark" ? "light" : "dark";

        aturTema(temaBaru);

        try {
            localStorage.setItem("tema-website", temaBaru);
        } catch (error) {
            // Tetap berfungsi jika penyimpanan tidak tersedia.
        }
    });

    try {
        const temaTersimpan = localStorage.getItem("tema-website");
        aturTema(temaTersimpan === "light" ? "light" : "dark");
    } catch (error) {
        aturTema("dark");
    }
})();



// ANIMATED STATISTICS


(function () {
    const angkaStatistik = document.querySelectorAll(".stat-number");

    if (!angkaStatistik.length) return;

    const kurangiAnimasi = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function tampilkanAngka(elemen, nilai) {
        elemen.textContent = nilai + (elemen.dataset.suffix || "");
    }

    function animasikanAngka(elemen) {
        const target = Number(elemen.dataset.target);

        if (!Number.isFinite(target) || target < 0) {
            tampilkanAngka(elemen, 0);
            return;
        }

        if (kurangiAnimasi) {
            tampilkanAngka(elemen, target);
            return;
        }

        const durasi = 1000;
        const mulai = performance.now();

        function langkah(waktu) {
            const progres = Math.min((waktu - mulai) / durasi, 1);
            const halus = 1 - Math.pow(1 - progres, 3);
            const nilai = Math.round(target * halus);

            tampilkanAngka(elemen, nilai);

            if (progres < 1) {
                requestAnimationFrame(langkah);
            }
        }

        requestAnimationFrame(langkah);
    }

    if ("IntersectionObserver" in window) {
        const pengamatStatistik = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animasikanAngka(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.4 }
        );

        angkaStatistik.forEach(function (elemen) {
            pengamatStatistik.observe(elemen);
        });
    } else {
        angkaStatistik.forEach(animasikanAngka);
    }
})();


/* ===================================
   CIVIL ENGINEERING LAB
=================================== */

// Mengubah input menjadi meter
function keMeter(nilai, satuan) {
    return satuan === "mm" ? nilai / 1000 : nilai;
}

// Membuat angka lebih mudah dibaca
function formatAngka(nilai, desimal = 4) {
    return nilai.toLocaleString("id-ID", {
        maximumFractionDigits: desimal
    });
}

// Mengecek apakah input angka valid dan positif
function inputValid(nilai) {
    return Number.isFinite(nilai) && nilai > 0;
}

// ===================================
// 1. KALKULATOR LUAS PENAMPANG
// ===================================

const formArea = document.getElementById("area-form");

if (formArea) {
    formArea.addEventListener("submit", function (event) {
        event.preventDefault();

        const lebar = Number(
            document.getElementById("area-width").value
        );
        const tinggi = Number(
            document.getElementById("area-height").value
        );
        const satuan = document.getElementById("area-unit").value;
        const hasil = document.getElementById("area-result");

        if (!inputValid(lebar) || !inputValid(tinggi)) {
            hasil.textContent = "Masukkan lebar dan tinggi lebih dari 0.";
            return;
        }


        // Hitung dalam satuan meter
        const lebarMeter = keMeter(lebar, satuan);
        const tinggiMeter = keMeter(tinggi, satuan);

        const luasM2 = lebarMeter * tinggiMeter;
        const luasMm2 = luasM2 * 1000000;

        hasil.textContent =
            "Luas penampang: " + formatAngka(luasM2, 6) + " m²" +
            " | " + formatAngka(luasMm2, 2) + " mm²";

            simpanRiwayatSipil(
    "Luas Penampang",
    "Lebar: " + lebar + " " + satuan +
    ", tinggi: " + tinggi + " " + satuan,
    formatAngka(luasM2, 6) + " m² | " +
    formatAngka(luasMm2, 2) + " mm²"
);
    });
}

// ===================================
// 2. KALKULATOR VOLUME BETON
// ===================================

const formVolume = document.getElementById("volume-form");

if (formVolume) {
    formVolume.addEventListener("submit", function (event) {
        event.preventDefault();

        const panjang = Number(
            document.getElementById("volume-length").value
        );
        const lebar = Number(
            document.getElementById("volume-width").value
        );
        const tinggi = Number(
            document.getElementById("volume-height").value
        );
        const satuan = document.getElementById("volume-unit").value;
        const hasil = document.getElementById("volume-result");

        if (
            !inputValid(panjang) ||
            !inputValid(lebar) ||
            !inputValid(tinggi)
        ) {
            hasil.textContent =
                "Semua dimensi harus diisi dengan angka lebih dari 0.";
            return;
        }

        

        const p = keMeter(panjang, satuan);
        const b = keMeter(lebar, satuan);
        const h = keMeter(tinggi, satuan);

        const volume = p * b * h;

        hasil.textContent =
            "Volume beton: " + formatAngka(volume, 6) + " m³" +
            " | " + formatAngka(volume * 1000000, 2) + " liter";
   
   simpanRiwayatSipil(
    "Volume Beton",
    "Panjang: " + panjang + ", lebar: " + lebar +
    ", tinggi: " + tinggi + " " + satuan,
    formatAngka(volume, 6) + " m³ | " +
    formatAngka(volume * 1000, 2) + " liter"
);
        });
}

// ===================================
// 3. ESTIMATOR KEBUTUHAN BATA
// ===================================

const formBrick = document.getElementById("brick-form");

if (formBrick) {
    formBrick.addEventListener("submit", function (event) {
        event.preventDefault();

        const panjang = Number(
            document.getElementById("wall-length").value
        );
        const tinggi = Number(
            document.getElementById("wall-height").value
        );
        const bukaan = Number(
            document.getElementById("wall-openings").value
        );
        const bataPerM2 = Number(
            document.getElementById("brick-rate").value
        );
        const cadangan = Number(
            document.getElementById("brick-waste").value
        );

        const hasil = document.getElementById("brick-result");

        if (
            !inputValid(panjang) ||
            !inputValid(tinggi) ||
            !Number.isFinite(bukaan) ||
            bukaan < 0 ||
            !inputValid(bataPerM2) ||
            !Number.isFinite(cadangan) ||
            cadangan < 0
        ) {
            hasil.textContent =
                "Periksa input. Dimensi dan kebutuhan bata harus lebih dari 0; bukaan dan cadangan tidak boleh negatif.";
            return;
        }

        const luasKotor = panjang * tinggi;

        if (bukaan >= luasKotor) {
            hasil.textContent =
                "Total luas bukaan harus lebih kecil daripada luas dinding.";
            return;
        }


        const luasBersih = luasKotor - bukaan;
        const jumlahDasar = luasBersih * bataPerM2;
        const jumlahCadangan = jumlahDasar * (cadangan / 100);
        const totalBata = Math.ceil(jumlahDasar + jumlahCadangan);

        hasil.textContent =
            "Luas dinding bersih: " + formatAngka(luasBersih, 2) + " m²" +
            " | Estimasi bata termasuk cadangan: " +
            totalBata.toLocaleString("id-ID") + " buah.";

            simpanRiwayatSipil(
    "Estimasi Kebutuhan Bata",
    "Dinding: " + panjang + " × " + tinggi +
    " m, bukaan: " + bukaan + " m², cadangan: " +
    cadangan + "%",
    formatAngka(luasBersih, 2) + " m² | " +
    totalBata.toLocaleString("id-ID") + " buah bata"
);
    });
    
}


/* ===================================
   CIVIL ENGINEERING HISTORY
=================================== */

const KUNCI_RIWAYAT_SIPIL = "abuy_civil_history_v1";
const MAKS_RIWAYAT_SIPIL = 100;

function bacaRiwayatSipil() {
    try {
        const data = localStorage.getItem(KUNCI_RIWAYAT_SIPIL);
        if (!data) return [];

        const riwayat = JSON.parse(data);

        if (!Array.isArray(riwayat)) return [];

        return riwayat.filter(function (item) {
            return item &&
                typeof item.id === "string" &&
                typeof item.judul === "string" &&
                typeof item.hasil === "string" &&
                typeof item.waktu === "string";
        });
    } catch (error) {
        console.error("Gagal membaca riwayat:", error);
        return [];
    }
}

function simpanRiwayatSipil(judul, detail, hasil) {
    const dataBaru = {
        id: Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8),
        judul: judul,
        detail: detail,
        hasil: hasil,
        waktu: new Date().toISOString()
    };

    const riwayat = bacaRiwayatSipil();
    riwayat.unshift(dataBaru);

    try {
        localStorage.setItem(
            KUNCI_RIWAYAT_SIPIL,
            JSON.stringify(riwayat.slice(0, MAKS_RIWAYAT_SIPIL))
        );
        tampilkanRiwayatSipil();
    } catch (error) {
        console.error("Gagal menyimpan riwayat:", error);
        alert("Riwayat gagal disimpan. Periksa pengaturan penyimpanan browser.");
    }
}

function tampilkanRiwayatSipil() {
    const daftar = document.getElementById("civil-history-list");
    const jumlah = document.getElementById("history-count");

    if (!daftar || !jumlah) return;

    const riwayat = bacaRiwayatSipil();
    jumlah.textContent = riwayat.length + " perhitungan tersimpan";
    daftar.replaceChildren();

    if (riwayat.length === 0) {
        const kosong = document.createElement("p");
        kosong.className = "civil-history-empty";
        kosong.textContent =
            "Belum ada riwayat. Coba lakukan perhitungan dulu!";
        daftar.appendChild(kosong);
        return;
    }

    riwayat.forEach(function (item) {
        const kartu = document.createElement("article");
        kartu.className = "civil-history-item";

        const judul = document.createElement("h4");
        judul.textContent = item.judul;

        const detail = document.createElement("p");
        detail.textContent = item.detail;

        const hasil = document.createElement("p");
        hasil.textContent = "Hasil: " + item.hasil;

        const tanggal = document.createElement("p");
        tanggal.className = "civil-history-date";

        const waktu = new Date(item.waktu);
        tanggal.textContent = Number.isNaN(waktu.getTime())
            ? "Waktu tidak diketahui"
            : waktu.toLocaleString("id-ID");

        const tombolHapus = document.createElement("button");
        tombolHapus.type = "button";
        tombolHapus.textContent = "Hapus riwayat ini";
        tombolHapus.addEventListener("click", function () {
            hapusRiwayatSipil(item.id);
        });

        kartu.append(judul, detail, hasil, tanggal, tombolHapus);
        daftar.appendChild(kartu);
    });
}

function hapusRiwayatSipil(id) {
    const riwayat = bacaRiwayatSipil().filter(function (item) {
        return item.id !== id;
    });

    try {
        localStorage.setItem(KUNCI_RIWAYAT_SIPIL, JSON.stringify(riwayat));
        tampilkanRiwayatSipil();
    } catch (error) {
        console.error("Gagal menghapus riwayat:", error);
        alert("Riwayat gagal diperbarui.");
    }
}

const tombolHapusSemua = document.getElementById("clear-history");

if (tombolHapusSemua) {
    tombolHapusSemua.addEventListener("click", function () {
        const riwayat = bacaRiwayatSipil();

        if (riwayat.length === 0) return;

        if (confirm("Yakin ingin menghapus semua riwayat perhitungan?")) {
            try {
                localStorage.removeItem(KUNCI_RIWAYAT_SIPIL);
                tampilkanRiwayatSipil();
            } catch (error) {
                console.error("Gagal menghapus riwayat:", error);
                alert("Riwayat gagal dihapus.");
            }
        }
    });
}

// Tampilkan data tersimpan saat halaman dibuka
tampilkanRiwayatSipil();


/* ===================================
   EKSPOR RIWAYAT KE CSV
=================================== */

(function () {
    const tombolEkspor = document.getElementById("export-history");

    if (!tombolEkspor) return;

    tombolEkspor.addEventListener("click", function () {
        const riwayat = bacaRiwayatSipil();

        if (riwayat.length === 0) {
            alert("Belum ada riwayat perhitungan untuk diekspor genk!.");
            return;
        }

        // Mengamankan teks agar tanda kutip dan koma tidak merusak CSV
        function amanCSV(nilai) {
            let teks = String(nilai ?? "");

            // Mencegah teks dari riwayat dianggap sebagai rumus Excel
            if (/^[\s]*[=+\-@]/.test(teks)) {
                teks = "'" + teks;
            }

            return '"' + teks.replace(/"/g, '""') + '"';
        }

        const baris = [
            ["Tanggal", "Jenis Perhitungan", "Detail Input", "Hasil"],
            ...riwayat.map(function (item) {
                return [
                    new Date(item.waktu).toLocaleString("id-ID"),
                    item.judul,
                    item.detail,
                    item.hasil
                ];
            })
        ];

        // BOM membantu Excel mengenali karakter Indonesia dengan benar
        const isiCSV =
            "\uFEFF" +
            baris.map(function (kolom) {
                return kolom.map(amanCSV).join(";");
            }).join("\r\n");

        const file = new Blob(
            [isiCSV],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.download = "riwayat-teknik-sipil.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 1000);
    });
})();


/* ===================================
   CETAK / SIMPAN SEBAGAI PDF
=================================== */

(function () {
    const tombolCetak = document.getElementById("print-history");

    if (!tombolCetak) return;

    tombolCetak.addEventListener("click", function () {
        const riwayat = bacaRiwayatSipil();

        if (riwayat.length === 0) {
            alert("Belum ada riwayat perhitungan untuk dicetak, Buy!");
            return;
        }

        window.print();
    });
})();

/* ===================================
   DETAIL PERHITUNGAN - LUAS
=================================== */

(function () {
    const tombolDetail = document.getElementById("area-detail-button");
    const detail = document.getElementById("area-detail-content");
    const formula = document.getElementById("area-formula");

    if (!tombolDetail || !detail || !formula) return;

    tombolDetail.addEventListener("click", function () {

        detail.classList.toggle("active");

        if (detail.classList.contains("active")) {
            tombolDetail.textContent = "Sembunyikan Detail";

            const panjang = document.getElementById("area-width").value;
            const tinggi = document.getElementById("area-height").value;
            const satuan = document.getElementById("area-unit").value;

            formula.innerHTML = `
                <strong>Rumus:</strong><br>
                Luas = panjang × tinggi<br><br>

                Luas = ${panjang} × ${tinggi}<br>

                <strong>Luas = ${formatAngka(
                    Number(panjang) * Number(tinggi)
                )} ${satuan}²</strong>
            `;
        } else {
            tombolDetail.textContent = "Lihat Detail Perhitungan";
        }
    });
})();
/* ===================================
   DETAIL PERHITUNGAN - VOLUME
=================================== */

(function () {
    const tombolDetail = document.getElementById("volume-detail-button");
    const detail = document.getElementById("volume-detail-content");
    const formula = document.getElementById("volume-formula");

    if (!tombolDetail || !detail || !formula) return;

    tombolDetail.addEventListener("click", function () {

        detail.classList.toggle("active");

        if (detail.classList.contains("active")) {
            tombolDetail.textContent = "Sembunyikan Detail";

            const panjang = document.getElementById("volume-length").value;
            const lebar = document.getElementById("volume-width").value;
            const tinggi = document.getElementById("volume-height").value;
            const satuan = document.getElementById("volume-unit").value;

            const hasil =
                Number(panjang) *
                Number(lebar) *
                Number(tinggi);

            formula.innerHTML = `
                <strong>Rumus:</strong><br>
                Volume = panjang × lebar × tinggi<br><br>

                Volume = ${panjang} × ${lebar} × ${tinggi}<br>

                <strong>Volume = ${formatAngka(hasil)} ${satuan}³</strong>
            `;
        } else {
            tombolDetail.textContent = "Lihat Detail Perhitungan";
        }
    });
})();
/* ===================================
   DETAIL PERHITUNGAN - BATA
=================================== */

(function () {
    const tombolDetail = document.getElementById("brick-detail-button");
    const detail = document.getElementById("brick-detail-content");
    const formula = document.getElementById("brick-formula");

    if (!tombolDetail || !detail || !formula) return;

    tombolDetail.addEventListener("click", function () {

        detail.classList.toggle("active");

        if (detail.classList.contains("active")) {
            tombolDetail.textContent = "Sembunyikan Detail";

            const panjangDinding =
                Number(document.getElementById("wall-length").value);

            const tinggiDinding =
                Number(document.getElementById("wall-height").value);

            const bukaan =
                Number(document.getElementById("wall-openings").value);

            const kebutuhanPerM2 =
                Number(document.getElementById("brick-rate").value);

            const waste =
                Number(document.getElementById("brick-waste").value);

            const luasDinding =
                panjangDinding * tinggiDinding;

            const luasBersih =
                luasDinding - bukaan;

            const bataDasar =
                luasBersih * kebutuhanPerM2;

            const tambahanWaste =
                bataDasar * (waste / 100);

            const totalBata =
                bataDasar + tambahanWaste;

            formula.innerHTML = `
                <strong>Langkah 1 — Luas dinding</strong><br>
                Luas = panjang × tinggi<br>
                = ${formatAngka(panjangDinding)} × ${formatAngka(tinggiDinding)}<br>
                = <strong>${formatAngka(luasDinding)} m²</strong>
                <br><br>

                <strong>Langkah 2 — Luas bersih</strong><br>
                Luas bersih = luas dinding − luas bukaan<br>
                = ${formatAngka(luasDinding)} − ${formatAngka(bukaan)}<br>
                = <strong>${formatAngka(luasBersih)} m²</strong>
                <br><br>

                <strong>Langkah 3 — Kebutuhan bata</strong><br>
                Bata = luas bersih × kebutuhan per m²<br>
                = ${formatAngka(luasBersih)} × ${formatAngka(kebutuhanPerM2)}<br>
                = <strong>${formatAngka(bataDasar)} bata</strong>
                <br><br>

                <strong>Langkah 4 — Tambahan waste</strong><br>
                Waste = ${formatAngka(bataDasar)} × ${formatAngka(waste)}%<br>
                = <strong>${formatAngka(tambahanWaste)} bata</strong>
                <br><br>

                <strong>Hasil akhir</strong><br>
                ${formatAngka(bataDasar)} + ${formatAngka(tambahanWaste)}
                = <strong>${formatAngka(totalBata)} bata</strong>
            `;
        } else {
            tombolDetail.textContent = "Lihat Detail Perhitungan";
        }
    });
})();