// Ganti dengan konfigurasi Firebase milik Anda!
  const firebaseConfig = {
    apiKey: "AIzaSyBSsQ4lJkzSaE63yUlnYJRJuOxL2_QIRls",
    authDomain: "tahfidz-unggulan.firebaseapp.com",
    projectId: "tahfidz-unggulan",
    storageBucket: "tahfidz-unggulan.firebasestorage.app",
    messagingSenderId: "183486003001",
    appId: "1:183486003001:web:81db57839d5b03dc555ae8",
   measurementId: "G-H7JE9HL51W"

  };


firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- Variabel Global untuk data ---
let siswaList = [];
let setoranList = [];

// --- Helper Format Tanggal (DD/MM/YYYY) ---
function formatTanggal(tgl) {
  if (!tgl) return "-";
  const d = new Date(tgl);
  if (isNaN(d)) return tgl;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// --- Data Surat Juz 30 ---
const suratJuz30 = [
  { nama: "An-Naba'", ayat: 40 },
  { nama: "An-Nazi'at", ayat: 46 },
  { nama: "Abasa", ayat: 42 },
  { nama: "At-Takwir", ayat: 29 },
  { nama: "Al-Infithar", ayat: 19 },
  { nama: "Al-Muthaffifin", ayat: 36 },
  { nama: "Al-Insyiqaq", ayat: 25 },
  { nama: "Al-Buruj", ayat: 22 },
  { nama: "At-Tariq", ayat: 17 },
  { nama: "Al-A'la", ayat: 19 },
  { nama: "Al-Ghasyiyah", ayat: 26 },
  { nama: "Al-Fajr", ayat: 30 },
  { nama: "Al-Balad", ayat: 20 },
  { nama: "Asy-Syams", ayat: 15 },
  { nama: "Al-Lail", ayat: 21 },
  { nama: "Adh-Dhuha", ayat: 11 },
  { nama: "Al-Insyirah", ayat: 8 },
  { nama: "At-Tin", ayat: 8 },
  { nama: "Al-'Alaq", ayat: 19 },
  { nama: "Al-Qadr", ayat: 5 },
  { nama: "Al-Bayyinah", ayat: 8 },
  { nama: "Az-Zalzalah", ayat: 8 },
  { nama: "Al-'Adiyat", ayat: 11 },
  { nama: "Al-Qari'ah", ayat: 11 },
  { nama: "At-Takatsur", ayat: 8 },
  { nama: "Al-Ashr", ayat: 3 },
  { nama: "Al-Humazah", ayat: 9 },
  { nama: "Al-Fil", ayat: 5 },
  { nama: "Quraisy", ayat: 4 },
  { nama: "Al-Ma'un", ayat: 7 },
  { nama: "Al-Kautsar", ayat: 3 },
  { nama: "Al-Kafirun", ayat: 6 },
  { nama: "An-Nashr", ayat: 3 },
  { nama: "Al-Lahab", ayat: 5 },
  { nama: "Al-Ikhlas", ayat: 4 },
  { nama: "Al-Falaq", ayat: 5 },
  { nama: "An-Nas", ayat: 6 }
];

// --- Inisialisasi Select Surat & Ayat ---
function isiSelectSurat() {
  const suratSelect = document.getElementById("surat");
  suratSelect.innerHTML = `<option value="">Pilih Surat</option>`;
  suratJuz30.forEach((s, idx) => {
    suratSelect.innerHTML += `<option value="${idx}">${s.nama} (${s.ayat} ayat)</option>`;
  });
}
isiSelectSurat();

document.getElementById("surat").addEventListener("change", function() {
  const idx = parseInt(this.value);
  const surat = suratJuz30[idx];
  const dariAyat = document.getElementById("dari-ayat");
  const sampaiAyat = document.getElementById("sampai-ayat");
  dariAyat.innerHTML = "";
  sampaiAyat.innerHTML = "";
  if (!surat) return;
  for (let i = 1; i <= surat.ayat; i++) {
    dariAyat.innerHTML += `<option value="${i}">${i}</option>`;
    sampaiAyat.innerHTML += `<option value="${i}">${i}</option>`;
  }
  dariAyat.value = "1";
  sampaiAyat.value = surat.ayat+"";
});

// --- Modal Siswa ---
document.getElementById("open-form-siswa").onclick = () => {
  document.getElementById("modal-siswa").classList.add("active");
};
document.getElementById("close-form-siswa").onclick = () => {
  document.getElementById("modal-siswa").classList.remove("active");
};

// --- CRUD Siswa ke Firestore ---
function addSiswa(nama, kelas) {
  return db.collection("siswa").add({
    nama,
    kelas,
    created_at: firebase.firestore.FieldValue.serverTimestamp()
  });
}
function hapusSiswa(id) {
  return db.collection("siswa").doc(id).delete();
}
function getSiswaRealtime(callback) {
  db.collection("siswa").orderBy("created_at").onSnapshot(snapshot => {
    const siswa = [];
    snapshot.forEach(doc => {
      siswa.push({ id: doc.id, ...doc.data() });
    });
    callback(siswa);
  });
}

// --- CRUD Setoran ke Firestore ---
function addSetoran(obj) {
  return db.collection("setoran").add({
    ...obj,
    created_at: firebase.firestore.FieldValue.serverTimestamp()
  });
}
function hapusSetoran(id) {
  return db.collection("setoran").doc(id).delete();
}
function getSetoranRealtime(callback) {
  db.collection("setoran").orderBy("created_at").onSnapshot(snapshot => {
    const setoran = [];
    snapshot.forEach(doc => {
      setoran.push({ id: doc.id, ...doc.data() });
    });
    callback(setoran);
  });
}

// --- Form Tambah Siswa ---
document.getElementById("form-siswa").onsubmit = function(e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value.trim();
  const kelas = document.getElementById("kelas").value;
  if (!nama || !kelas) return;
  addSiswa(nama, kelas).then(() => {
    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";
  });
};

// --- Render Daftar Siswa di Modal ---
function renderSiswaModal() {
  const daftar = document.getElementById("daftar-siswa");
  daftar.innerHTML = "";
  siswaList.forEach(s => {
    daftar.innerHTML += `
      <div style="margin-bottom:3px;">
        ${s.nama} (${s.kelas})
        <button aria-label="Hapus" style="color:#b71c1c;font-weight:bold;font-size:1em;border:none;background:none;cursor:pointer;" onclick="hapusSiswa('${s.id}')">🗑️</button>
      </div>`;
  });
}

// --- Sinkronisasi Siswa ke Select Form Setoran & Filter ---
function syncSiswaSelect() {
  const siswaSelect = document.getElementById("siswa");
  siswaSelect.innerHTML = "";
  siswaList.forEach(s => {
    siswaSelect.innerHTML += `<option value="${s.id}">${s.nama} (${s.kelas})</option>`;
  });

  // Filter nama
  const filterNama = document.getElementById("filter-nama");
  filterNama.innerHTML = `<option value="">Semua Siswa</option>`;
  siswaList.forEach(s => {
    filterNama.innerHTML += `<option value="${s.id}">${s.nama}</option>`;
  });

  // Filter kelas
  const kelasSet = new Set(siswaList.map(s=>s.kelas));
  const filterKelas = document.getElementById("filter-kelas");
  filterKelas.innerHTML = `<option value="">Semua Kelas</option>`;
  Array.from(kelasSet).sort().forEach(k => {
    filterKelas.innerHTML += `<option value="${k}">${k}</option>`;
  });
}

// --- Real-time Listener Siswa & Setoran ---
getSiswaRealtime(function(siswa){
  siswaList = siswa;
  renderSiswaModal();
  syncSiswaSelect();
  renderRiwayat();
  renderGlobalProgress();
  renderChart();
});
getSetoranRealtime(function(setoran){
  setoranList = setoran;
  renderRiwayat();
  renderGlobalProgress();
  renderChart();
});

// --- Form Setoran Hafalan ---
document.getElementById("form-setoran").onsubmit = function(e) {
  e.preventDefault();
  const siswaId = document.getElementById("siswa").value;
  const tanggal = document.getElementById("tanggal").value;
  const suratIdx = document.getElementById("surat").value;
  const surat = suratJuz30[suratIdx]?.nama || "";
  const dariAyat = document.getElementById("dari-ayat").value;
  const sampaiAyat = document.getElementById("sampai-ayat").value;
  const status = document.getElementById("status").value;
  const catatan = document.getElementById("catatan").value.trim();

  if (!siswaId || !tanggal || suratIdx === "" || !dariAyat || !sampaiAyat || !status) return;
  const siswaObj = siswaList.find(s=>s.id===siswaId);
  if (!siswaObj) return;

  addSetoran({
    siswaId,
    nama: siswaObj.nama,
    kelas: siswaObj.kelas,
    tanggal,
    surat,
    dariAyat: parseInt(dariAyat),
    sampaiAyat: parseInt(sampaiAyat),
    status,
    catatan
  }).then(() => {
    document.getElementById("tanggal").value = "";
    document.getElementById("surat").value = "";
    document.getElementById("dari-ayat").innerHTML = "";
    document.getElementById("sampai-ayat").innerHTML = "";
    document.getElementById("status").value = "";
    document.getElementById("catatan").value = "";
  });
};

// --- Render Riwayat Setoran ---
function renderRiwayat() {
  const tbody = document.querySelector("#tabel-riwayat tbody");
  tbody.innerHTML = "";
  const filterNama = document.getElementById("filter-nama").value;
  const filterKelas = document.getElementById("filter-kelas").value;
  let filtered = setoranList;
  if (filterNama) filtered = filtered.filter(s=>s.siswaId===filterNama);
  if (filterKelas) filtered = filtered.filter(s=>s.kelas===filterKelas);

  filtered.forEach(item => {
    tbody.innerHTML +=
      `<tr>
        <td>${item.nama}</td>
        <td>${item.kelas}</td>
        <td style="white-space:normal;word-break:break-word;max-width:90px;">${formatTanggal(item.tanggal)}</td>
        <td style="white-space:normal;word-break:break-word;max-width:150px;">${item.surat}</td>
        <td>${item.dariAyat}</td>
        <td>${item.sampaiAyat}</td>
        <td>${item.status}</td>
        <td>${item.catatan || ""}</td>
      </tr>`;
  });
}

// --- Progress Global ---
function renderGlobalProgress() {
  let totalAyatJuz = suratJuz30.reduce((a,s)=>a+s.ayat,0);
  let totalAyatSetor = 0;
  let siswaAktif = new Set();
  setoranList.forEach(s => {
    totalAyatSetor += Math.max(0, (s.sampaiAyat-s.dariAyat+1));
    siswaAktif.add(s.siswaId);
  });
  let persen = totalAyatSetor/(totalAyatJuz*(siswaList.length||1))*100;
  persen = Math.round(persen*10)/10;
  document.getElementById("global-progress-bar").style.width = Math.min(persen,100)+"%";
  document.getElementById("global-progress-bar").textContent = persen+"%";
  document.getElementById("global-progress-label").textContent = `${siswaAktif.size} siswa sudah setor hafalan`;
}

// --- Grafik Progress per Siswa ---
let chart;
function renderChart() {
  const ctx = document.getElementById('chartProgres').getContext('2d');
  // Hitung total ayat setor per siswa
  let totalAyatJuz = suratJuz30.reduce((a,s)=>a+s.ayat,0);
  let siswaMap = {};
  siswaList.forEach(s => siswaMap[s.id]={...s, total:0});
  setoranList.forEach(s => {
    if (siswaMap[s.siswaId]) {
      siswaMap[s.siswaId].total += Math.max(0, (s.sampaiAyat-s.dariAyat+1));
    }
  });
  let labels = [];
  let data = [];
  for (const id in siswaMap) {
    labels.push(siswaMap[id].nama);
    data.push(Math.round(siswaMap[id].total/totalAyatJuz*100));
  }
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Progress (%)',
        data,
        backgroundColor: '#2d6cdf'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 }
      }
    }
  });
}

// --- Filter Riwayat ---
document.getElementById("filter-nama").onchange = renderRiwayat;
document.getElementById("filter-kelas").onchange = renderRiwayat;

// --- Reset Data (Hapus Semua) ---
document.getElementById("reset-data").onclick = function() {
  if (!confirm("Yakin ingin menghapus semua data?")) return;
  // Hapus semua setoran
  db.collection("setoran").get().then(snap => {
    snap.forEach(doc => db.collection("setoran").doc(doc.id).delete());
  });
  // Hapus semua siswa
  db.collection("siswa").get().then(snap => {
    snap.forEach(doc => db.collection("siswa").doc(doc.id).delete());
  });
};

// --- Laporan Wali Murid (Sederhana) ---
document.getElementById("btn-laporan-wali").onclick = function() {
  let isi = "";
  let totalAyatJuz = suratJuz30.reduce((a,s)=>a+s.ayat,0);
  siswaList.forEach(s => {
    let ayatSetor = setoranList.filter(x=>x.siswaId===s.id)
      .reduce((a,x)=>a+Math.max(0,x.sampaiAyat-x.dariAyat+1),0);
    let persen = Math.round(ayatSetor/totalAyatJuz*100);
    isi += `<b>${s.nama} (${s.kelas})</b>: ${ayatSetor} ayat (${persen}%)<br>`;
  });
  document.getElementById("laporan-wali-isi").innerHTML = isi;
  document.getElementById("modal-laporan").classList.add("active");
};
document.getElementById("btn-tutup-laporan").onclick = function() {
  document.getElementById("modal-laporan").classList.remove("active");
};
document.getElementById("btn-salin-laporan").onclick = function() {
  let isi = document.getElementById("laporan-wali-isi").innerText;
  navigator.clipboard.writeText(isi);
  alert("Laporan sudah disalin ke clipboard!");
};

// --- Export Data (JSON) ---
document.getElementById("btn-export").onclick = function() {
  let data = {
    siswa: siswaList,
    setoran: setoranList
  };
  let blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "data_hafalan.json";
  a.click();
};

// --- Import Data (JSON) ---
document.getElementById("btn-import").onclick = function() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = function(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function(ev) {
      try {
        let data = JSON.parse(ev.target.result);
        if (confirm("Import akan menambah data siswa dan setoran dari file. Lanjutkan?")) {
          if (Array.isArray(data.siswa)) {
            data.siswa.forEach(s => addSiswa(s.nama, s.kelas));
          }
          if (Array.isArray(data.setoran)) {
            data.setoran.forEach(x => addSetoran(x));
          }
        }
      } catch (err) { alert("Gagal import: "+err); }
    };
    reader.readAsText(file);
  };
  input.click();
};

// --- Cetak Grafik ---
document.getElementById("btn-print-chart").onclick = function() {
  window.print();
};

window.hapusSiswa = hapusSiswa; // agar bisa dipanggil dari tombol modal