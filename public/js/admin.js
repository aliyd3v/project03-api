
(function getAdmins() {
    let token = localStorage.getItem('token')
    fetch('/admins', {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(response => {
            console.log(response)
        })
})()

window.onload = function () {
    loading();
};
function loading() {
    let containerLoad = document.querySelector(".container-loader");
    containerLoad.style.display = "none";
}