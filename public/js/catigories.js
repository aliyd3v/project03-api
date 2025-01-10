document.addEventListener("DOMContentLoaded", () => {
    const api = "https://project06.onrender.com/category";
    
    // Modalni boshqarish funksiyalari
    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) modal.style.display = "grid";
    }

    function closeModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) modal.style.display = "none";
    }

    // Kategoriyalarni yaratish funksiyasi
    function createProduct(array) {
        const productContainer = document.querySelector("#pruduct-container");
        const categoryCount = document.querySelector("#cotygory-length");

        if (!productContainer || !categoryCount) return;

        productContainer.innerHTML = ""; // Oldingi elementlarni tozalash
        categoryCount.textContent = array.length;

        if (array.length === 0) {
            productContainer.innerHTML = `<p class="text-white">Kategoriya mavjud emas.</p>`;
            return;
        }

        array.forEach(item => {
            const product = document.createElement("div");
            product.classList.add(
                "w-full",
                "gap-7",
                "rounded-xl",
                "flex",
                "items-center",
                "p-4",
                "col-span-2",
                "bg-black",
                "justify-between"
            );
            product.setAttribute("data-id", item._id);

            product.innerHTML = `
                <div class="flex gap-3 items-center">
                    <div class="w-32 h-32 rounded-full overflow-hidden">
                        <img class="w-full" src="${item.image_url}" alt="Mahsulot rasm">
                    </div>
                    <div class="w-[300px]">
                        <h1 class="text-white text-3xl">${item.en_name}</h1>
                        <p class="text-[#999] text-xl">Maxsulotlar: ${item.meals.length}</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="button bg-green-600 edit-cotigory">
                        <div class="button-wrapper">
                            <div class="text">Edit</div>
                            <span class="icon"><i class="fa-solid fa-pen"></i></span>
                        </div>
                    </div>
                    <div class="button bg-red-600 del-cotigory">
                        <div class="button-wrapper">
                            <div class="text">Del</div>
                            <span class="icon"><i class="fa-solid fa-trash"></i></span>
                        </div>
                    </div>
                </div>
            `;
            productContainer.appendChild(product);
        });
    }

    // Kategoriyalarni yuklash funksiyasi
    function getCategories() {
        fetch(api)
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    createProduct(response.data.categories);
                }
            })
            .catch(error => console.error("Xatolik:", error));
    }

    // Kategoriya o'chirish funksiyasi
    function deleteCategory(id) {
        const token = localStorage.getItem("token");

        fetch(`${api}/${id}/delete`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    Toastify({
                        text: "Kategoriya muvaffaqiyatli o'chirildi!",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                            color: "#fff",
                            fontWeight: "bold",
                        },
                    }).showToast();
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    Toastify({
                        text: `Xatolik: ${response.error.message}`,
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                            color: "#fff",
                            fontWeight: "bold",
                        },
                    }).showToast();
                }
            })
            .catch(error => {
                alert("Xatolik: " + error.message);
            });
    }

    // Kategoriya tahrirlash funksiyasi
    function editCategory(id, updatedData) {
        const token = localStorage.getItem("token");

        fetch(`${api}/${id}/edit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    Toastify({
                        text: "Kategoriya muvaffaqiyatli tahrirlandi!",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            color: "#fff",
                            fontWeight: "bold",
                        },
                    }).showToast();
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    Toastify({
                        text: `Xatolik: ${response.error.message}`,
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                            color: "#fff",
                            fontWeight: "bold",
                        },
                    }).showToast();
                }
            })
            .catch(error => {
                alert("Xatolik: " + error.message);
            });
    }

    // Add va Delete modallarni boshqarish
    document.addEventListener("click", event => {
        // Modal ochish
        if (event.target.closest("#openAdd")) openModal("#cotigory-add");
        if (event.target.closest("#closeAdd")) closeModal("#cotigory-add");
        if (event.target.closest("#del-canceling")) closeModal("#cotigory-del");

        // Kategoriya o'chirish
        if (event.target.closest(".del-cotigory")) {
            const deleteModal = document.querySelector("#cotigory-del");
            const parentElement = event.target.closest(".w-full");
            const selectedId = parentElement?.getAttribute("data-id");

            if (deleteModal && selectedId) {
                deleteModal.setAttribute("data-selected-id", selectedId);
                openModal("#cotigory-del");
            }
        }

        // Kategoriya tahrirlash
        if (event.target.closest(".edit-cotigory")) {
            const parentElement = event.target.closest(".w-full");
            const selectedId = parentElement?.getAttribute("data-id");

            if (selectedId) {
                fetch(`${api}/${selectedId}`)
                    .then(response => response.json())
                    .then(response => {
                        if (response.success) {
                            const category = response.data.category;
                            document.querySelector("#edit_en_name").value = category.en_name;
                            document.querySelector("#edit_ru_name").value = category.ru_name;
                            
                            openModal("#cotigory-edit");
                            document.querySelector("#edit-form").setAttribute("data-id", selectedId);
                        }
                    });
            }
        }

        if (event.target.closest("#edit-submit")) {
            const selectedId = document.querySelector("#edit-form").getAttribute("data-id");
            const enName = document.querySelector("#edit_en_name").value.trim();
            const ruName = document.querySelector("#edit_ru_name").value.trim();
            const imgEdit = document.querySelector(".preview-image")

            if (!enName || !ruName || !imgEdit) {
                alert("Iltimos, barcha maydonlarni to'ldiring!");
                return;
            }

            const updatedData = { en_name: enName, ru_name: ruName, image_name:imgEdit };
            editCategory(selectedId, updatedData);
            closeModal("#cotigory-edit");
        }
    });

    const addButton = document.querySelector("#add-btn");
    const cotigoryAddSection = document.querySelector("#cotigory-add");

    addButton.addEventListener("click", () => {
        cotigoryAddSection.style.display = "grid";
    });

    // Kategoriya qo'shish
    const formData = document.querySelector("#formData");

    formData?.addEventListener("submit", (e) => {
        e.preventDefault();

        const enName = document.querySelector("#add_en_name").value.trim();
        const ruName = document.querySelector("#add_ru_name").value.trim();
        const imageFile = document.querySelector("#add_img_file").files[0];

        if (!enName || !ruName || !imageFile) {
            alert("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        const formDataObj = new FormData();
        formDataObj.append("en_name", enName);
        formDataObj.append("ru_name", ruName);
        formDataObj.append("file", imageFile);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Iltimos, tizimga kiring!");
            return;
        }

        fetch(`${api}/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formDataObj,
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    cotigoryAddSection.style.display = "none";
                    Toastify({
                        text: "Kategoriya muvaffaqiyatli qo'shildi!",
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                            color: "#fff",
                            fontWeight: "bold",
                        },
                    }).showToast();
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    Toastify({
                        text: `Xatolik: ${response.error.message}`,
                        duration: 3000,
                        style: {
                            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                            color: "#fff",
                            fontWeight: "bold",
                        },
                    }).showToast();
                }
            })
            .catch((error) => {
                alert("Xatolik: " + error.message);
            });
    });

    // Kategoriyalarni yuklashni boshlash
    getCategories();
});
