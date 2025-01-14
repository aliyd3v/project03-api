// Loader closer.
let containerLoad = document.querySelector(".container-loader");

window.onload = function () {
    loading();
};

function loading() {
    containerLoad.style.display = "none";
}