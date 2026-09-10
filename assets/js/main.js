// main.js
document.addEventListener("DOMContentLoaded", function () {
  fetch("/Html/navBar.html")
    .then((response) => {
      if (!response.ok)
        throw new Error("No se pudo cargar la barra de navegación");
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
    })
    .catch((error) => console.error("Error:", error));
});

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("carousel-slides-container");
  if (!container) return;

  // 1. Llamamos al archivo JSON externo
  fetch("/assets/json/slides.json")
    .then((response) => {
      if (!response.ok)
        throw new Error("No se pudieron cargar los datos del carrusel");
      return response.json(); // Convertimos el texto del archivo a un objeto/array real
    })
    .then((slidesData) => {
      // 2. Recorremos los datos exactamente igual que antes
      slidesData.forEach((slide, index) => {
        const isActive = index === 0 ? "active" : "";

        const slideHTML = `
                    <div class="carousel-item ${isActive}">
                        <div class="container">
                            <div class="row p-5">
                                <div class="mx-auto col-md-8 col-lg-6 order-lg-last">
                                    <img class="img-fluid" src="${slide.imagen}" alt="${slide.subtitulo}">
                                </div>
                                <div class="col-lg-6 mb-0 d-flex align-items-center">
                                    <div class="text-align-left align-self-center">
                                        <h1 class="h1 text-success">${slide.titulo}</h1>
                                        <h3 class="h2">${slide.subtitulo}</h3>
                                        <p>${slide.descripcion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        container.innerHTML += slideHTML;
      });

      // 3. Inicializamos el carrusel de Bootstrap después de inyectar todo
      const myCarousel = document.querySelector(
        "#template-mo-zay-hero-carousel",
      );
      if (myCarousel) {
        new bootstrap.Carousel(myCarousel);
      }
    })
    .catch((error) => console.error("Error cargando el carrusel:", error));
});

// formulario de suscripción
const form = document.getElementById("subscribeForm");
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("subscribeForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que la página se recargue o redirija

    const statusDiv = document.getElementById("formStatus");
    const formData = new FormData(this);

    // Mostramos un mensaje de carga
    statusDiv.style.display = "block";
    statusDiv.innerText = "Enviando...";

    // Enviamos los datos en segundo plano a FormSubmit
    fetch("https://formsubmit.co", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          statusDiv.innerText = "¡Gracias! Te has suscrito correctamente.";
          this.reset(); // Limpia el campo de texto
        } else {
          statusDiv.innerText = "Hubo un error. Inténtalo de nuevo.";
        }
      })
      .catch((error) => {
        statusDiv.innerText = "Error de conexión. Inténtalo más tarde.";
      });
  });
  });
}


  let paginaActual = 1;
const productosPorPagina = 9;
let listaProductos = [];

async function cargarBanners() {
  const contenedor = document.getElementById("contenedor-banners");
  if (!contenedor) return;

  try {
    const respuesta = await fetch("/assets/json/items.json");
    listaProductos = await respuesta.json();

    renderizarPagina(paginaActual);
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
}

function renderizarPagina(pagina) {
  paginaActual = pagina;
  const contenedor = document.getElementById("contenedor-banners");
  
  // Calcular los índices de inicio y fin para los 9 ítems
  const inicio = (pagina - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = listaProductos.slice(inicio, fin);

  // Cada tarjeta utiliza col-md-4 y col-lg-4 para asegurar 3 elementos por fila
  contenedor.innerHTML = productosPagina.map(item => `
    <div class="col-md-4 col-lg-4 mb-4">
      <div class="card h-100 product-wap rounded-0">
        <div class="card rounded-0">
          <img class="card-img rounded-0 img-fluid" src="${item.imagen}" alt="${item.titulo}">
          <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center"></div>
        </div>
        <div class="card-body">
          <a href="#" class="h3 text-decoration-none">${item.titulo}</a>
          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
            <li>${item.subtitulo}</li>
          </ul>
          <p class="text-center mb-0">${item.descripcion}</p>
        </div>
      </div>
    </div>
  `).join('');

  renderizarPaginacion();
}

function renderizarPaginacion() {
  const contenedorPaginacion = document.getElementById("contenedor-paginacion");
  if (!contenedorPaginacion) return;

  const totalPaginas = Math.ceil(listaProductos.length / productosPorPagina);
  let htmlPaginacion = "";

  for (let i = 1; i <= totalPaginas; i++) {
    htmlPaginacion += `
      <li class="page-item ${i === paginaActual ? 'active' : ''}">
        <button class="page-link rounded-0 mr-3 shadow-sm border-top-0 border-left-0 ${i === paginaActual ? '' : 'text-dark'}" 
                onclick="renderizarPagina(${i})">
          ${i}
        </button>
      </li>
    `;
  }

  contenedorPaginacion.innerHTML = htmlPaginacion;
}

document.addEventListener("DOMContentLoaded", cargarBanners);