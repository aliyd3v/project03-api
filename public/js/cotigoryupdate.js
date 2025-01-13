document.addEventListener("DOMContentLoaded", () => {

    // Open Modal Function
    function openModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) modal.style.display = "grid";
    }

    // Close Modal Function
    function closeModal(modalId) {
        const modal = document.querySelector(modalId);
        if (modal) modal.style.display = "none";
    }

    // Edit Category Functionality
    document.addEventListener("click", event => {
        // Open Edit Modal and Populate Fields
        if (event.target.closest(".edit-cotigory")) {
            const parentElement = event.target.closest(".w-full");
            const selectedId = parentElement?.getAttribute("data-id");

            if (selectedId) {
                fetch(`/category/${selectedId}`)
                    .then(response => response.json())
                    .then(response => {
                        if (response.success) {
                            const category = response.data.category;
                            document.querySelector("#edit_en_name").value = category.en_name;
                            document.querySelector("#edit_ru_name").value = category.ru_name;
                            document.querySelector("#edit-image-preview").src = category.image_url || ""; // Set existing image URL
                            document.querySelector("#edit-image-preview").classList.remove("hidden"); // Show preview if image exists

                            openModal("#cotigory-edit");
                            document.querySelector("#edit-form").setAttribute("data-id", selectedId);
                        }
                    })
                    .catch(err => console.error("Error fetching category:", err));
            }
        }

        // Close Edit Modal
        if (event.target.closest("#closeEdit")) {
            closeModal("#cotigory-edit");
        }

        // Handle Image Upload Preview
        const editImgFile = document.querySelector("#edit_img_file");
        if (editImgFile) {
            editImgFile.addEventListener("change", function () {
                const file = this.files[0];
                const preview = document.querySelector("#edit-image-preview");
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        preview.src = e.target.result;
                        preview.classList.remove("hidden"); // Show image preview
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle Edit Submit
        if (event.target.closest("#edit-submit")) {
            const selectedId = document.querySelector("#edit-form").getAttribute("data-id");
            const enName = document.querySelector("#edit_en_name").value.trim();
            const ruName = document.querySelector("#edit_ru_name").value.trim();
            const imageFile = document.querySelector("#edit_img_file").files[0];
            const imageUrl = imageFile ? imageFile.name : document.querySelector("#edit-image-preview").src;

            if (!enName || !ruName || !imageUrl) {
                alert("Please fill in all fields!");
                return;
            }

            const updatedData = { en_name: enName, ru_name: ruName, image_url: imageUrl };
            const token = localStorage.getItem("token");

            // Send update request
            fetch(`/category/${selectedId}/update`, {
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
                        alert("Category updated successfully!");
                        closeModal("#cotigory-edit");
                        setTimeout(() => window.location.reload(), 2000); // Reload the page
                    } else {
                        alert("Error updating category!");
                    }
                })
                .catch(err => console.error("Error:", err));
        }
    });
});
