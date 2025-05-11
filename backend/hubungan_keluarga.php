<?php
// Koneksi ke database
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'silsilah_keluarga';

// Membuat koneksi
$conn = new mysqli($host, $username, $password, $database);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Ambil data dari POST
$id_anggota1 = $_POST['anggota1'] ?? null;
$id_anggota2 = $_POST['anggota2'] ?? null;

// Validasi input
if (!$id_anggota1 || !$id_anggota2) {
    echo json_encode(['error' => 'Anggota keluarga tidak valid.']);
    exit;
}

// Fungsi untuk mendapatkan nama anggota keluarga
function getNama($conn, $id) {
    $query = "SELECT nama FROM anggota_keluarga WHERE id_anggota = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row['nama'] ?? 'Tidak Diketahui';
}

// Query untuk mendeteksi hubungan keluarga
function cekHubungan($conn, $id1, $id2) {
    // Cek hubungan langsung
    $query = "
        SELECT
            CASE
                WHEN a1.id_ayah = a2.id_anggota THEN 'anak dari'
                WHEN a1.id_ibu = a2.id_anggota THEN 'anak dari'
                WHEN a1.id_anggota = a2.id_ayah THEN 'ayah dari'
                WHEN a1.id_anggota = a2.id_ibu THEN 'ibu dari'
                WHEN a1.id_ayah = a2.id_ayah AND a1.id_ibu = a2.id_ibu THEN 'saudara kandung dari'
                WHEN a1.id_pasangan = a2.id_anggota THEN 'pasangan dari'
                ELSE 'hubungan tidak diketahui'
            END AS hubungan
        FROM anggota_keluarga a1
        JOIN anggota_keluarga a2 ON a1.id_anggota = ?
        WHERE a2.id_anggota = ?
    ";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $id1, $id2);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    return $row['hubungan'] ?? 'hubungan tidak diketahui';
}

// Dapatkan nama anggota keluarga
$nama1 = getNama($conn, $id_anggota1);
$nama2 = getNama($conn, $id_anggota2);

// Cek hubungan
$hubungan = cekHubungan($conn, $id_anggota1, $id_anggota2);

// Kembalikan hasil
$response = [
    'anggota1' => $nama1,
    'anggota2' => $nama2,
    'hubungan' => $hubungan
];

echo json_encode($response);

// Tutup koneksi
$conn->close();
?>