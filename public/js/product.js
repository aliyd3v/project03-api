// API URL
let apiURL = "https://project06.onrender.com/meal";

// DOMContentLoaded eventida ma'lumotlarni yuklash
document.addEventListener("DOMContentLoaded", function () {
  fetchData();

  // Hodisa delegatsiyasi
  document.body.addEventListener("click", function (event) {
    const target = event.target;

    if (target.matches(".button-edit")) {
      const itemId = target.dataset.id;
      editItem(itemId);
    } else if (target.matches(".button-delete")) {
      const itemId = target.dataset.id;
      showDeletePopup(itemId);
    }
  });

  // Formani yuborish hodisasi
  const createForm = document.getElementById("create-form");
  if (createForm) {
    createForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const newItem = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image").value,
      };
      addNewItem(newItem);
    });
  }

  document.getElementById("del-canceling")?.addEventListener("click", hideDeletePopup);
  document.getElementById("del-pruduct")?.addEventListener("click", confirmDeleteItem);
});

function fetchData() {
  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched data:", data);
      const meals = data.data.meals;
      if (Array.isArray(meals)) {
        displayItemsFromAPI(meals);
      } else {
        console.error("No meals array found in response:", data);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function displayItemsFromAPI(meals) {
  const dataContainer = document.getElementById("data-container");
  dataContainer.innerHTML = meals
    .map(
      (item) => `
      <div style="margin-top:20px;" class="bg-main-bg flex items-center justify-around mt-6 w-full h-60 rounded-xl mx-auto sm:mr-0 group cursor-pointer lg:mx-auto transition-all duration-500">
        <div class="rounded-xl">
          <img src="${item.image_url}" alt="${item.en_name}" class="w-full h-52 aspect-square object-cover">
        </div>
        <div class="w-[70%] h-52">
          <div class="flex items-center justify-between">
            <h6 class="font-semibold text-xl leading-8 text-white transition-all duration-500 group-hover:text-indigo-600">
              ${item.en_name}
            </h6>
            <h6 class="font-semibold text-xl leading-8 text-indigo-600">
              $${item.price}
            </h6>
          </div>
          <div class="mt-3">
            <ul class="list-none overflow-scroll h-32 w-[300px]">
              <li class="mt-2 font-normal text-sm leading-6 text-gray-500">${item.en_description}</li>
            </ul>
          </div>
          <div class="flex gap-3 ml-[600px]">
            <div class="button bg-green-600" data-id="${item._id}">
              <div class="button-wrapper">
                <div class="text">Edit</div>
                <span class="icon"><i class="fa-solid fa-pen"></i></span>
              </div>
            </div>
            <div class="button bg-red-600 button-delete" data-id="${item._id}">
              <div class="button-wrapper">
                <div class="text">Del</div>
                <span class="icon"><i class="fa-solid fa-trash"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");  // Join all the items into a single string to be injected into the container
}

// Show the delete confirmation popup
function showDeletePopup(itemId) {
  const delPopup = document.getElementById("del-popup");
  const delProductButton = document.getElementById("del-pruduct");

  // Store the itemId on the confirm button
  delProductButton.dataset.id = itemId;
  
  // Change the popup visibility by removing 'hidden' and adding 'grid'
  delPopup.classList.remove("hidden");
  delPopup.classList.add("grid");
}


function hideDeletePopup() {
  const delPopup = document.getElementById("del-popup");
  delPopup.classList.add("hidden");
  delPopup.classList.remove("grid");
}


function confirmDeleteItem() {
  const itemId = document.getElementById("del-pruduct").dataset.id;
  deleteItem(itemId);
  hideDeletePopup(); 
}


function addNewItem(newItem) {
  fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Added new item:", data);
      fetchData(); 
    })
    .catch((error) => console.error("Error adding new item:", error));
}


function deleteItem(itemId) {
  fetch(`${apiURL}/${itemId}/delete`, {
    method: "DELETE",
  })
    .then(() => {
      console.log(`Deleted item with ID: ${itemId}`);
      fetchData();
    })
    .catch((error) => console.error("Error deleting item:", error));
}


function editItem(itemId) {
  const updatedData = {
    title: "Updated Title",
    price: "$150",
    description: "Updated description",
  };

  fetch(`${apiURL}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Updated item:", data);
      fetchData();
    })
    .catch((error) => console.error("Error updating item:", error));
}
