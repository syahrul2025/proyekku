<?php
// Aktifkan error reporting untuk debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Sertakan koneksi database
include 'db.php';

// Cek apakah request menggunakan metode GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query untuk mengambil data keluarga
    $query = "
        SELECT 
            a.id_anggota, 
            a.nama, 
            a.gender, 
            a.tanggal_lahir, 
            a.usia,
            a.id_ayah,
            a.id_ibu,
            a.id_pasangan,
            a.foto, 
            ayah.nama AS nama_ayah, 
            ibu.nama AS nama_ibu, 
            pasangan.nama AS nama_pasangan
        FROM anggota_keluarga a
        LEFT JOIN anggota_keluarga ayah ON a.id_ayah = ayah.id_anggota
        LEFT JOIN anggota_keluarga ibu ON a.id_ibu = ibu.id_anggota
        LEFT JOIN anggota_keluarga pasangan ON a.id_pasangan = pasangan.id_anggota
    ";

    $result = $conn->query($query);
    $data = [];
    
    if ($result) {
        // Ambil semua data dari hasil query
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        // Set header response sebagai JSON
        header('Content-Type: application/json');
        echo json_encode($data);
    } else {
        // Jika query gagal
        http_response_code(500);
        echo json_encode(["error" => "Gagal mengambil data keluarga: " . $conn->error]);
    }
} else {
    // Jika metode request bukan GET
    http_response_code(405);
    echo json_encode(["error" => "Metode tidak diizinkan"]);
}
?>