document.getElementById("add-member-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const formData = new FormData(this);
    fetch("backend/anggota_api.php?action=add", {
        method: "POST",
        body: formData,
    })
        .then(response => response.text())
        .then(result => {
            alert(result); // Tampilkan hasil dari backend
            window.location.href = "index.html"; // Redirect ke halaman utama
        })
        .catch(error => {
            console.error("Error adding member:", error);
            alert("Terjadi kesalahan saat menambahkan anggota!");
        });
});



document.addEventListener("DOMContentLoaded", function () {
    const ayahDropdown = document.getElementById("ayah");
    const ibuDropdown = document.getElementById("ibu");
    const pasanganDropdown = document.getElementById("pasangan");

    // Fetch data for parents and pasangan
    fetch("http://localhost/Silsilah-Keluarga-Bani-Achmad-Zabidi/backend/anggota_api.php?action=get_parents")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error fetching members:", data.error);
                return;
            }
			
			// Urutkan data berdasarkan nama secara alfabetis
            data.sort((a, b) => a.nama.localeCompare(b.nama));
			
            data.forEach(member => {
                // Populate Ayah dropdown
                const ayahOption = document.createElement("option");
                ayahOption.value = member.id_anggota;
                ayahOption.textContent = member.nama;
                ayahDropdown.appendChild(ayahOption);

                // Populate Ibu dropdown
                const ibuOption = document.createElement("option");
                ibuOption.value = member.id_anggota;
                ibuOption.textContent = member.nama;
                ibuDropdown.appendChild(ibuOption);

                // Populate Pasangan dropdown
                const pasanganOption = document.createElement("option");
                pasanganOption.value = member.id_anggota;
                pasanganOption.textContent = member.nama;
                pasanganDropdown.appendChild(pasanganOption);
            });
        })
        .catch(error => {
            console.error("Error fetching members:", error);
        });
});