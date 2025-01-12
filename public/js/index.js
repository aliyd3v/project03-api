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
    window.location.href = "/product"
})

let cotigories = document.querySelector("#cotigories")
cotigories.addEventListener("click", () => {
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
