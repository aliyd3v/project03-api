const token = localStorage.getItem('token')
if (!token) window.location.href = '/login'
fetch('/checking/token', {
    headers: { 'Authorization': `Bearer ${token}` }
})
    .then(response => response.json())
    .then(response => {
        if (!response.success) {
            localStorage.removeItem('token')
            alert("Login failed: " + response.error.message)
            return window.location.href = "/login"
        }
    })
    .catch(error => {
        alert("Error: " + error.message);
    })


let logOut = document.getElementById("logout")

logOut.addEventListener("click", logout)
function logout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
}

let home = document.querySelector("#home")
home.addEventListener("click", () => {
    window.localStorage.href = "/"
})

let products = document.querySelector("#products")
products.addEventListener("click", () => {
    window.location.href = "/meal"
})

let category = document.querySelector("#category")
category.addEventListener("click", () => {
    window.location.href = "/category"
})

let history = document.querySelector("#history")
history.addEventListener("click", () => {
    window.location.href = "/history"
})

let order = document.querySelector("#order")
order.addEventListener("click", () => {
    window.location.href = "/order"
})
