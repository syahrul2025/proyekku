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

// Query untuk mengambil data anggota keluarga
$query = "SELECT id_anggota, nama FROM anggota_keluarga ORDER BY nama ASC";
$result = $conn->query($query);

// Inisialisasi array untuk menyimpan hasil
$data = [];

if ($result->num_rows > 0) {
    // Loop melalui hasil query
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'id' => $row['id_anggota'],
            'nama' => $row['nama']
        ];
    }
}

// Kembalikan hasil dalam format JSON
header('Content-Type: application/json');
echo json_encode($data);

// Tutup koneksi
$conn->close();
?>