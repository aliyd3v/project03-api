let form = document.getElementById("form");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Formaning standart xatti-harakatini to'xtatadi

    // Submit paytida username va password qiymatlarini yangidan olamiz
    let username = document.getElementById("user-name").value;
    let password = document.getElementById("password").value;

    logIn(username, password); // LogIn funksiyasini chaqirish
});

function logIn(username, password) {
    // fetch('http://192.168.0.118:5050/category/:id/delete',{
    //     method:"POST"
    // })
    fetch('https://project06.onrender.com/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                let token = response.data.token
                localStorage.setItem('token', token)
                return window.location.href = "index.html"
            } else {
                alert("Login failed: " + response.error.message)
            }
        })
        .catch(error => {
            alert("Error: " + error.message);
        });
}
