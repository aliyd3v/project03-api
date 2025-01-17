

fetch('/admins', {
    method: "GET",
    headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
})
    .then(response => response.json())
    .then(response => {
        console.log(response)
    })
