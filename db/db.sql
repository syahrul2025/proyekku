CREATE DATABASE IF NOT EXISTS silsilah_keluarga;
USE silsilah_keluarga;

CREATE TABLE anggota_keluarga (
    id_anggota INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    gender ENUM('Laki-Laki', 'Perempuan') NOT NULL,
    tanggal_lahir DATE NOT NULL,
    usia INT GENERATED ALWAYS AS (YEAR(CURDATE()) - YEAR(tanggal_lahir)) STORED,
    foto VARCHAR(255) DEFAULT 'default.jpg'
);