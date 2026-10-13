// Cargar el Navbar de forma dinámica desde navbar.html
document.addEventListener("DOMContentLoaded", () => {
    fetch('navBar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo navbar.html');
            }
            return response.text();
        })
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (navbarContainer) {
                navbarContainer.innerHTML = data;
            }
        })
        .catch(error => console.error('Error al cargar el navbar:', error));
});