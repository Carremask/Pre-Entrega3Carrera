principal();

function principal() {
  let productosOriginal = [
    {
      id: 1,
      nombre: "Fernet",
      categoria: "Con alcohol",
      stock: 2,
      precio: 5000,
      rutaImagen: "fernet.webp",
    },
    {
      id: 2,
      nombre: "Coca cola",
      categoria: "Sin alcohol",
      stock: 7,
      precio: 850,
      rutaImagen: "cocacola.jpg",
    },
    {
      id: 3,
      nombre: "Gancia",
      categoria: "Con alcohol",
      stock: 4,
      precio: 2750,
      rutaImagen: "gancia.jpg",
    },
    {
      id: 4,
      nombre: "sprite",
      categoria: "Sin alcohol",
      stock: 1,
      precio: 850,
      rutaImagen: "sprite.jpg",
    },
    {
      id: 5,
      nombre: "Campari",
      categoria: "Con alcohol",
      stock: 3,
      precio: 300,
      rutaImagen: "campari.jpg",
    },
    {
      id: 6,
      nombre: "Cepita",
      categoria: "Sin alcohol",
      stock: 8,
      precio: 500,
      rutaImagen: "jugocepita.jpg",
    },
  ];

  let inputBuscador = document.getElementById("buscador");
  inputBuscador.addEventListener("input", () =>
    filtrarPorNombre(productosOriginal, inputBuscador)
  );

  let filtrosCategoria = document.getElementsByClassName("filtroCategoria");
  for (const filtroCategoria of filtrosCategoria) {
    filtroCategoria.addEventListener("click", () =>
      filtrar(productosOriginal, filtroCategoria, "categoria")
    );
  }

  let botonFinalizarCompra = document.getElementById("finalizarCompra");
  botonFinalizarCompra.addEventListener("click", finalizarCompra);

  renderizarCarrito();
  renderizarTarjetas(productosOriginal);
}

function finalizarCompra() {
  let carrito = recuperarCarrito();
  if (carrito.length > 0) {
    localStorage.removeItem("carrito");
    renderizarCarrito();
    Swal.fire({
      title: "Gracias por su compra!",
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No tiene productos en su carrito ",
    });
  }
}


function filtrarPorNombre(productos, input) {
  const textoBusqueda = input.value.toLowerCase();
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoBusqueda)
  );
  renderizarTarjetas(productosFiltrados);
}

function renderizarTarjetas(productos) {
  let contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach((producto) => {
    let tarjetaProducto = document.createElement("div");
    tarjetaProducto.classList.add("tarjetaProducto");
    tarjetaProducto.innerHTML = `
      <h3>${producto.nombre}</h3>
      <img src= /images/${producto.rutaImagen} />
      <p>${producto.precio}</p>
      <button id=${producto.id}>Agregar al carrito</button>
    `;
    contenedor.appendChild(tarjetaProducto);

    let botonAgregarAlCarrito = document.getElementById(producto.id);
    botonAgregarAlCarrito.addEventListener("click", (e) =>
      agregarAlCarrito(productos, e)
    );
    botonAgregarAlCarrito.addEventListener("click", (e) => {
      Swal.fire({
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
    });
  });
}


function agregarAlCarrito(productos, e) {
  let carrito = recuperarCarrito();
  let productoBuscado = productos.find(
    (producto) => producto.id === Number(e.target.id)
  );
  let productoEnCarrito = carrito.find(
    (producto) => producto.id === productoBuscado.id
  );
  if (productoBuscado.stock > 0) {
    productoBuscado.stock--;

    if (productoEnCarrito) {
      productoEnCarrito.unidades++;
      productoEnCarrito.subtotal =
        productoEnCarrito.precioUnitario * productoEnCarrito.unidades;
    } else {
      carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        subtotal: productoBuscado.precio, // Inicializa el subtotal con el precio unitario
        unidades: 1,
      });
    }
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderizarCarrito();
}

function calcularTotalCarrito(carrito) {
  return carrito.reduce((total, producto) => total + producto.subtotal, 0);
}

function renderizarCarrito() {
  let contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";
  let carrito = recuperarCarrito();

  carrito.forEach((producto) => {
    let tarjetaProducto = document.createElement("div");

    tarjetaProducto.innerHTML = `
      <p>${producto.nombre}</p>
      <p>${producto.precioUnitario}</p>
      <p>${producto.unidades}</p>
      <p>${producto.subtotal}</p>
    `;
    contenedor.appendChild(tarjetaProducto);
  });

  // Calcula y muestra el total del carrito
  let total = calcularTotalCarrito(carrito);
  let totalElement = document.createElement("div");
  totalElement.innerHTML = `
    <p>Total: $${total.toFixed(2)}</p>
  `;
  contenedor.appendChild(totalElement);
}

function recuperarCarrito() {
  return localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
}