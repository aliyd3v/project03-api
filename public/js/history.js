function toggleDetails(element) {
    // Find the details section in the parent container
    const orderContainer = element.closest('.order-container');
    const details = orderContainer.querySelector('.details');
    // Toggle the visibility
    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
    } else {
        details.classList.add('hidden');
    }
}


function getHistory(page, limit) {
    fetch(`/histories/?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
    })
}

// Example orders data
const orders = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    date: `2024-11-${27 - (index % 30)}`,
    orderId: `ORD-${1000 + index}`,
    status: index % 3 === 0 ? "Delivered" : index % 3 === 1 ? "Pending" : "Cancelled",
    products: [
        { name: "Product A", price: (10 + index).toFixed(2) },
        { name: "Product B", price: (15 + index).toFixed(2) }
    ]
}));

// Pagination variables
const ordersPerPage = 10;
let currentPage = 1;

// Render orders for the current page
function renderOrders(page) {
    const ordersContainer = document.getElementById("orders-container");
    const start = (page - 1) * ordersPerPage;
    const end = start + ordersPerPage;
    const pageOrders = orders.slice(start, end);

    ordersContainer.innerHTML = ""; // Clear previous orders
    pageOrders.forEach(order => {
        const totalPrice = order.products.reduce((sum, product) => sum + parseFloat(product.price), 0).toFixed(2);
        const orderDiv = `
            <div class="order-container bg-[#222] p-4 rounded-lg mb-3">
                <div class="flex justify-between items-center">
                    <p class="w-[10%] text-center">${order.id}</p>
                    <p class="w-[20%] text-center">${order.date}</p>
                    <p class="w-[25%] text-center">${order.orderId}</p>
                    <p class="w-[20%] text-center ${order.status === "Delivered" ? "text-green-500" : order.status === "Pending" ? "text-yellow-500" : "text-red-500"}">
                        ${order.status}
                    </p>
                    <p class="w-[25%] text-center text-[#ffc335] cursor-pointer hover:underline" onclick="toggleDetails(this)">View Details</p>
                </div>
                <div class="details hidden mt-3 p-3 bg-[#333] rounded-lg">
                    <p class="text-lg font-bold mb-2">Products:</p>
                    ${order.products.map(product => `
                        <div class="flex justify-between">
                            <p>${product.name}</p>
                            <p>$${product.price}</p>
                        </div>
                    `).join('')}
                    <div class="flex justify-between font-bold mt-3">
                        <p>Total Price:</p>
                        <p>$${totalPrice}</p>
                    </div>
                </div>
            </div>
        `;
        ordersContainer.innerHTML += orderDiv;
    });
}

// Render pagination buttons
function renderPagination() {
    const paginationContainer = document.getElementById("pagination");
    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const range = 3; // Range of pages to show around the current page

    paginationContainer.innerHTML = ""; // Clear previous buttons

    // "Previous" button
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.className = "px-3 py-2 rounded-lg bg-[#222] text-white";
        prevButton.onclick = () => {
            currentPage--;
            renderOrders(currentPage);
            renderPagination();
        };
        paginationContainer.appendChild(prevButton);
    }

    // Page range (only show relevant pages)
    const startPage = Math.max(1, currentPage - range);
    const endPage = Math.min(totalPages, currentPage + range);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = `px-3 py-2 rounded-lg ${i === currentPage ? "bg-[#ffc335] text-black" : "bg-[#222] text-white"}`;
        button.onclick = () => {
            currentPage = i;
            renderOrders(currentPage);
            renderPagination();
        };
        paginationContainer.appendChild(button);
    }

    // "Next" button
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.className = "px-3 py-2 rounded-lg bg-[#222] text-white";
        nextButton.onclick = () => {
            currentPage++;
            renderOrders(currentPage);
            renderPagination();
        };
        paginationContainer.appendChild(nextButton);
    }
}

// Toggle details visibility
function toggleDetails(element) {
    const details = element.closest('.order-container').querySelector('.details');
    details.classList.toggle('hidden');
}

// Initial render
renderOrders(currentPage);
renderPagination();

// Loader closer.
let containerLoad = document.querySelector(".container-loader");
window.onload = function () {
    loading();
};
function loading() {
    containerLoad.style.display = "none";
}