document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("editAnggotaForm");
    const idAnggotaInput = document.getElementById("idAnggota");
    const namaInput = document.getElementById("nama");
    const genderInput = document.getElementById("gender");
    const tanggalLahirInput = document.getElementById("tanggalLahir");
    const ayahSelect = document.getElementById("ayah");
    const ibuSelect = document.getElementById("ibu");
    const pasanganSelect = document.getElementById("pasangan");
    const fotoPreview = document.getElementById("fotoPreview");
    const fotoInput = document.getElementById("foto");

    // Fetch and populate existing data
    async function fetchAnggotaData(id) {
        try {
            const response = await fetch(`anggota_api.php?action=get&id=${id}`);
            const data = await response.json();
            if (data.error) {
                alert(data.error);
                return;
            }

            // Populate form fields
            idAnggotaInput.value = data.id_anggota;
            namaInput.value = data.nama;
            genderInput.value = data.gender;
            tanggalLahirInput.value = data.tanggal_lahir;
            ayahSelect.value = data.id_ayah || "";
            ibuSelect.value = data.id_ibu || "";
            pasanganSelect.value = data.id_pasangan || "";
            fotoPreview.src = `../assets/img/${data.foto}`;
        } catch (error) {
            console.error("Error fetching anggota data:", error);
            alert("Gagal memuat data anggota.");
        }
    }

    // Fetch and populate parent options
    async function fetchParentOptions() {
        try {
            const response = await fetch("anggota_api.php?action=get_parents");
            const data = await response.json();
            if (data.error) {
                alert(data.error);
                return;
            }

            data.forEach((parent) => {
                const option = document.createElement("option");
                option.value = parent.id_anggota;
                option.textContent = parent.nama;

                ayahSelect.appendChild(option.cloneNode(true));
                ibuSelect.appendChild(option.cloneNode(true));
                pasanganSelect.appendChild(option.cloneNode(true));
            });
        } catch (error) {
            console.error("Error fetching parent options:", error);
            alert("Gagal memuat opsi orang tua.");
        }
    }

    // Handle form submission
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("anggota_api.php?action=update", {
                method: "POST",
                body: formData,
            });
            const result = await response.text();

            if (result.includes("berhasil")) {
                alert("Data anggota berhasil diperbarui.");
                window.location.reload();
            } else {
                alert("Gagal memperbarui data anggota: " + result);
            }
        } catch (error) {
            console.error("Error updating anggota data:", error);
            alert("Terjadi kesalahan saat menyimpan data anggota.");
        }
    });

    // Handle file input change for preview
    fotoInput.addEventListener("change", function () {
        const file = fotoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                fotoPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Initialize page
    const urlParams = new URLSearchParams(window.location.search);
    const idAnggota = urlParams.get("id");
    if (idAnggota) {
        fetchAnggotaData(idAnggota);
    } else {
        alert("ID anggota tidak ditemukan di URL.");
    }

    fetchParentOptions();
});