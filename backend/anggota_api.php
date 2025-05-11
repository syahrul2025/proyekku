<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

if ($_GET['action'] == 'get_all') {
    $query = "
        SELECT 
            a.id_anggota, 
            a.nama, 
            a.gender, 
            a.tanggal_lahir, 
            a.usia,
            a.id_ibu,
            a.id_ayah,
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
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    } else {
        echo json_encode(["error" => "Failed to retrieve family data: " . $conn->error]);
        exit;
    }
    
    // Urutkan data berdasarkan kolom 'nama'
    usort($data, function ($a, $b) {
        return strcmp($a['nama'], $b['nama']);
    });
    
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

if ($_GET['action'] == 'add') {
    $nama = $_POST['nama'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $tanggal_lahir = $_POST['tanggal_lahir'] ?? '';
    $id_ayah = !empty($_POST['ayah']) ? $_POST['ayah'] : null;
    $id_ibu = !empty($_POST['ibu']) ? $_POST['ibu'] : null;
    $id_pasangan = !empty($_POST['pasangan']) ? $_POST['pasangan'] : null;
    $foto = $_FILES['foto']['name'] ?? 'default.jpg';

    // Proses upload file
    if (!empty($_FILES['foto']['tmp_name'])) {
        move_uploaded_file($_FILES['foto']['tmp_name'], "../assets/img/" . $foto);
    }

    $stmt = $conn->prepare("INSERT INTO anggota_keluarga (nama, gender, tanggal_lahir, id_ayah, id_ibu, id_pasangan, foto) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiiis", $nama, $gender, $tanggal_lahir, $id_ayah, $id_ibu, $id_pasangan, $foto);

    if ($stmt->execute()) {
        echo "Anggota berhasil ditambahkan.";
    } else {
        echo "Gagal menambahkan anggota: " . $conn->error;
    }
    exit;
}

if ($_GET['action'] == 'get_parents') {
    $result = $conn->query("SELECT id_anggota, nama FROM anggota_keluarga");
    $data = [];
    
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    } else {
        echo json_encode(["error" => "Failed to retrieve parents: " . $conn->error]);
        exit;
    }
    
    // Urutkan data berdasarkan kolom 'nama'
    usort($data, function ($a, $b) {
        return strcmp($a['nama'], $b['nama']);
    });
    
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

if ($_GET['action'] == 'update') {
    $id_anggota = $_POST['id_anggota'];
    $nama = $_POST['nama'];
    $gender = $_POST['gender'];
    $tanggal_lahir = $_POST['tanggal_lahir'];
    $id_ayah = !empty($_POST['ayah']) ? $_POST['ayah'] : null;
    $id_ibu = !empty($_POST['ibu']) ? $_POST['ibu'] : null;
    $id_pasangan = !empty($_POST['pasangan']) ? $_POST['pasangan'] : null;

    $foto_name = null;
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] == 0) {
        $uploadDir = "../assets/img/";
        $extension = pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION);
        $safeName = 'foto_' . $id_anggota . '.' . strtolower($extension);
        $targetFile = $uploadDir . $safeName;

        // Hapus foto lama sebelum mengganti
        $oldPhotoQuery = $conn->prepare("SELECT foto FROM anggota_keluarga WHERE id_anggota = ?");
        $oldPhotoQuery->bind_param("i", $id_anggota);
        $oldPhotoQuery->execute();
        $oldPhotoResult = $oldPhotoQuery->get_result();
        if ($oldPhotoResult->num_rows > 0) {
            $oldPhoto = $oldPhotoResult->fetch_assoc()['foto'];
            if ($oldPhoto && file_exists($uploadDir . $oldPhoto)) {
                unlink($uploadDir . $oldPhoto);
            }
        }

        // Pindahkan file baru
        if (move_uploaded_file($_FILES['foto']['tmp_name'], $targetFile)) {
            $stmt = $conn->prepare("UPDATE anggota_keluarga SET nama = ?, gender = ?, tanggal_lahir = ?, id_ayah = ?, id_ibu = ?, id_pasangan = ?, foto = ? WHERE id_anggota = ?");
            $stmt->bind_param("sssiiisi", $nama, $gender, $tanggal_lahir, $id_ayah, $id_ibu, $id_pasangan, $safeName, $id_anggota);
        } else {
            echo "Gagal mengunggah foto.";
            exit;
        }
    } else {
        $stmt = $conn->prepare("UPDATE anggota_keluarga SET nama = ?, gender = ?, tanggal_lahir = ?, id_ayah = ?, id_ibu = ?, id_pasangan = ? WHERE id_anggota = ?");
        $stmt->bind_param("sssiiii", $nama, $gender, $tanggal_lahir, $id_ayah, $id_ibu, $id_pasangan, $id_anggota);
    }

    if ($stmt->execute()) {
                // Redirect ke halaman utama
        header("Location: ../index.html"); // Ganti dengan URL halaman utama Anda
        exit;
    } else {
        echo "Gagal memperbarui anggota: " . $conn->error;
    }
    exit;
}

if ($_GET['action'] == 'get') {
    $id = $_GET['id'] ?? null;

    if ($id) {
        $stmt = $conn->prepare("
            SELECT 
                a.id_anggota, 
                a.nama, 
                a.gender, 
                a.tanggal_lahir, 
                a.id_ayah, 
                a.id_ibu, 
                a.id_pasangan, 
                a.foto 
            FROM anggota_keluarga a
            WHERE a.id_anggota = ?
        ");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $data = $result->fetch_assoc();
            header('Content-Type: application/json');
            echo json_encode($data);
        } else {
            echo json_encode(["error" => "Anggota tidak ditemukan."]);
        }
    } else {
        echo json_encode(["error" => "ID tidak diberikan."]);
    }
    exit;
}

if ($_GET['action'] == 'delete' && isset($_GET['id'])) {
    $id = $_GET['id'];

    // Hapus foto terkait
    $photoQuery = $conn->prepare("SELECT foto FROM anggota_keluarga WHERE id_anggota = ?");
    $photoQuery->bind_param("i", $id);
    $photoQuery->execute();
    $photoResult = $photoQuery->get_result();
    if ($photoResult->num_rows > 0) {
        $photo = $photoResult->fetch_assoc()['foto'];
        if ($photo && file_exists("../assets/img/" . $photo)) {
            unlink("../assets/img/" . $photo);
        }
    }

    $query = "DELETE FROM anggota_keluarga WHERE id_anggota = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        die("Error preparing statement: " . $conn->error);
    }

    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>