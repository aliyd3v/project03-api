let logOut = document.getElementById("logout")

logOut.addEventListener("click", logout)
function logout() {
    localStorage.removeItem("token")
    window.location.href="login.html"
}





let home = document.querySelector("#home")
home.addEventListener("click" , () => {
    window.localStorage.href = "index.html"
})

let products = document.querySelector("#products")
products.addEventListener("click", () => {
    window.location.href = "product.html"

})


let cotigories = document.querySelector("#cotigories")
cotigories.addEventListener("click", () => {
    window.location.href = "cotigories.html"

})

let history = document.querySelector("#history")
history.addEventListener("click", () => {
    window.location.href = "history.html"

})


let order = document.querySelector("#order")
order.addEventListener("click", () => {
    window.location.href = "order.html"

})
