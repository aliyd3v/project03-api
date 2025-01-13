// Backenddan kelgan ma'lumotlar
const backendData = {
    totalPrice: 70000,
    items: [
        { id: 1, name: "Mail 1" },
        { id: 2, name: "Mail 2" },
        { id: 3, name: "Mail 3" },
    ],
};

// Barcha checkboxlar belgilanganini tekshirish uchun
function checkAllChecked() {
    const checkboxes = document.querySelectorAll('#checkbox-list input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every((checkbox) => checkbox.checked);
    const doneButton = document.getElementById("done");

    if (allChecked) {
        doneButton.disabled = false;
        doneButton.classList.remove("bg-gray-500", "text-gray-300", "cursor-not-allowed");
        doneButton.classList.add("bg-green-600", "text-white", "cursor-pointer");
    } else {
        doneButton.disabled = true;
        doneButton.classList.remove("bg-green-600", "text-white", "cursor-pointer");
        doneButton.classList.add("bg-gray-500", "text-gray-300", "cursor-not-allowed");
    }
}

// Getting checkboxes function.
function loadCheckboxes(data) {
    const list = document.getElementById("checkbox-list");
    list.innerHTML = ""; // Oldingi ma'lumotlarni tozalash

    data.items.forEach((item) => {
        const checkboxItem = `
            <li class="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    id="cbx-${item.id}" 
                    class="form-checkbox h-5 w-5 text-green-500">
                <label for="cbx-${item.id}" class="text-white">
                    ${item.name}
                </label>
            </li>
        `;
        list.insertAdjacentHTML("beforeend", checkboxItem);

        // Checkbox uchun event qo'shamiz
        document.getElementById(`cbx-${item.id}`).addEventListener("change", checkAllChecked);
    });

    // Umumiy narxni qo'shamiz
    document.getElementById("total-price").innerText = data.totalPrice;
}

// "Done" tugmasi bosilganda.
document.getElementById("done").addEventListener("click", () => {
    alert(`Buyurtma qabul qilindi. Umumiy narx: ${backendData.totalPrice} so'm. Rahmat!`);
});

// Getting data.
loadCheckboxes(backendData);
checkAllChecked(); // Boshlang'ich tugma holatini o'rnatish



// =====


