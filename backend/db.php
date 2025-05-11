<?php
// Path ke file JSON
$jsonFile = 'data.json';

// Ambil isi file JSON
$jsonData = file_get_contents($jsonFile);

// Decode data JSON menjadi array PHP
$data = json_decode($jsonData, true);

// Tampilkan data (contoh penggunaan)
foreach ($data as $item) {
    echo "Nama: " . $item['nama'] . "<br>";
    echo "Hubungan: " . $item['hubungan'] . "<br>";
    echo "<br>";
}
?>
