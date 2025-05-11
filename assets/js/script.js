document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#family-table tbody");

    // Fetch data anggota keluarga dari API
    fetch("backend/anggota_api.php?action=get_all")
        .then(response => response.json())
        .then(data => {
            data.forEach(member => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="assets/img/${member.foto || 'default.jpg'}" class="thumbnail" alt="Foto"></td>
                    <td>${member.nama}</td>
                    <td>${member.gender}</td>
                    <td>${member.tanggal_lahir}</td>
                    <td>${member.usia}</td>
                    <td>${member.nama_ayah || '-'}</td>
                    <td>${member.nama_ibu || '-'}</td>
                    <td>${member.nama_pasangan || '-'}</td>
                    <td>
                        <button class="edit-button" data-id="${member.id_anggota}">Edit</button>
                        <button class="delete-button" data-id="${member.id_anggota}">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Tambahkan event listener untuk tombol Edit
            document.querySelectorAll(".edit-button").forEach(button => {
                button.addEventListener("click", function () {
                    const id = this.getAttribute("data-id");
                    openEditForm(id);
                });
            });

            // Tambahkan event listener untuk tombol Hapus
            document.querySelectorAll(".delete-btn").forEach(button => {
				button.addEventListener("click", (e) => {
        const memberId = e.target.dataset.id;

			// Konfirmasi sebelum menghapus
			if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
            hapusAnggota(memberId, e.target);
					}
				});
			});
        .catch(error => console.error("Error fetching family data:", error));
});

// Fungsi untuk membuka form edit
function openEditForm(id) {
    // Redirect ke halaman edit atau tampilkan modal edit
    window.location.href = `edit_anggota.html?id=${id}`;
}



// Fungsi untuk menghapus anggota keluarga
function hapusAnggota(memberId, targetButton) {
    fetch(`http://localhost/Silsilah-Keluarga-Bani-Achmad-Zabidi/backend/anggota_api.php?action=delete&id=${memberId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert("Anggota berhasil dihapus.");
            // Hapus baris dari tabel
            targetButton.closest("tr").remove();
        } else {
            alert("Gagal menghapus anggota.");
        }
		 // Setelah menghapus, refresh data anggota keluarga
            window.location.reload();
    })
    .catch(error => {
        console.error("Error saat menghapus anggota:", error);
        alert("Terjadi kesalahan saat menghapus anggota.");
    });
}

function switchDropdown() {
    // Ambil elemen dropdown
    const personADropdown = document.getElementById("personA");
    const personBDropdown = document.getElementById("personB");

    // Simpan nilai sementara dari dropdown Person A
    const tempValue = personADropdown.value;

    // Tukar nilai dropdown
    personADropdown.value = personBDropdown.value;
    personBDropdown.value = tempValue;

    console.log(
        `Dropdown berhasil ditukar: Person A = ${personADropdown.value}, Person B = ${personBDropdown.value}`
    ); // Debugging: cek hasil penukaran
}

function switchDropdown() {
    // Ambil elemen dropdown
    const personADropdown = document.getElementById("personA");
    const personBDropdown = document.getElementById("personB");

    // Simpan nilai sementara dari dropdown Person A
    const tempValue = personADropdown.value;

    // Tukar nilai dropdown
    personADropdown.value = personBDropdown.value;
    personBDropdown.value = tempValue;

    console.log(
        `Dropdown berhasil ditukar: Person A = ${personADropdown.value}, Person B = ${personBDropdown.value}`
    ); // Debugging: cek hasil penukaran
}