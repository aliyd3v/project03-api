

fetch('/admins', {
    method: "GET",
    headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
})
    .then(response => response.json())
    .then(response => {
        console.log(response)
    })

window.onload = function () {
    loading();
};
function loading() {
    let containerLoad = document.querySelector(".container-loader");
    containerLoad.style.display = "none";
}