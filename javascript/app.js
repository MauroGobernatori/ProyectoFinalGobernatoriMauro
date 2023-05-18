let productos = [];
let carrito;

// Variables de los productos
let div_productos = document.getElementById('div_productos');
let btn_agregar_prod;

// Variables de los productos del carrito
let div_carrito = document.getElementById('div_carrito');
let btn_sumar_prod;
let btn_restar_prod;
let btn_eliminar_prod;
let btn_vaciar_carrito;

// Variables del ícono del carrito, y pop-up del carrito
let cart_popup = document.getElementById('cart_popup');
let carrito_icon = document.getElementById('cart_icon');
let close_popup = document.getElementById("close");
let div_total = document.getElementById('div_total');
let btn_realizar_compra = document.getElementById('btn_realizar_compra');

document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // Obtiene los productos de data.json

    carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];
    carrito.length > 0 && cargarCarrito();

    btn_vaciar_carrito = document.getElementById('btn_vaciar_carrito');
    btn_vaciar_carrito.addEventListener("click", vaciarCarrito);

    carrito_icon.addEventListener("click", mostrarCarrito);

    close_popup.addEventListener("click", ocultarCarrito);

    btn_realizar_compra.addEventListener("click", realizarCompra);

    Swal.fire({
        title: 'MauroCorp',
        text: '¡Bienvenidos a mi página! Disfruten.',
        icon: 'info',
        confirmButtonText: 'Entrar'
    });
});

async function fetchData(){
    let resultado = await fetch("javascript/data.json");
    let data = await resultado.json();
    productos = data;

    cargarProductos(); // Carga la lista de productos que se pueden agregar al carrito
    cargarEventListenersProductos(); // Agregar el event 'click' a los botones de los productos que se acaban de cargar
}

function cargarProductos(){
    productos.forEach(item => {
        div_productos.innerHTML += `
            <div class="">
                <h4>${item.nombre}</h4>
                <img src="${item.imagen}" alt=""></img>
                <p>$${item.precio}</p>
                <button name="btn_agregar_prod" class="btn_agregar_prod" value="${item.id}">Agregar al Carrito</button>
            </div>
        `;
    });
}

function cargarEventListenersProductos(){
    btn_agregar_prod = document.getElementsByName('btn_agregar_prod');
    btn_agregar_prod.forEach(element => {
        element.addEventListener("click", agregarProductoAlCarrito);
    });
}

function agregarProductoAlCarrito(){
    let producto_agregar = productos.find(producto => producto.id == this.value);

    if(!(carrito.find(item => item.id == producto_agregar.id && item.cantidad > 0))){
        producto_agregar.cantidad = 1;
        carrito.push(producto_agregar);
    }else{
        let index = carrito.indexOf(producto_agregar);
        carrito[index].cantidad = carrito[index].cantidad + 1;
    }
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function cargarCarrito(){
    if(carrito.length > 0){
        carrito_icon.src = "img/Full Cart.png";
    }else{
        carrito_icon.src = "img/Empty Cart.png";
    }
    div_carrito.innerHTML = "";

    carrito.forEach(item => {
        div_carrito.innerHTML += `
            <div class="item_carrito">
                <img class="item_carrito_img" src="${item.imagen}">
                <div>
                    <h3>${item.nombre}</h3>
                    <p>Precio: $${item.precio}</p>
                    <p>Total: $${item.precio * item.cantidad}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                    <p id="${item.id}">
                        <button name="sumar-item" class="sumar_item"><img src="img/Up Arrow.png" alt="up-arrow" class="cart-options"></button>
                        <button name="restar-item" class="restar_item"><img src="img/Down Arrow.png" alt="" class="cart-options"></button>
                        <button name="borrar-item" class="borrar_item"><img src="img/Trash Can.png" alt="" class="cart-options"></button>
                    </p>
                </div>
            </div>
        `;
    });

    calcularTotal();
    agregar_clicks();
}

function vaciarCarrito(){
    carrito_icon.src = "img/Empty Cart.png";
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    div_carrito.innerHTML = "";
    div_total.innerHTML = "<h3>Cantidad de productos: 0</h3><h3>Precio Total: $0</h3>";
}

function calcularTotal(){
    let total = 0;
    let cantidad = 0;
    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cantidad += item.cantidad;
    });

    div_total.innerHTML = "<h3>Cantidad de productos: "+cantidad+"</h3><h3>Precio Total: $"+total+"</h3>";
}

function agregar_clicks(){
    btn_sumar_prod = document.getElementsByName('sumar-item');
    btn_sumar_prod.forEach(element => {
        element.addEventListener("click", sumar_item);
    });

    btn_restar_prod = document.getElementsByName('restar-item');
    btn_restar_prod.forEach(element => {
        element.addEventListener("click", restar_item);
    });

    btn_eliminar_prod = document.getElementsByName('borrar-item');
    btn_eliminar_prod.forEach(element => {
        element.addEventListener("click", eliminar_item);
    });
}

function sumar_item(){
    item_id = this.parentElement.id;

    let elemento = carrito.find(element => element.id == item_id);
    elemento.cantidad = elemento.cantidad + 1;

    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function restar_item(){
    item_id = this.parentElement.id;
    
    let elemento = carrito.find(element => element.id == item_id);
    if(elemento.cantidad > 1){
        elemento.cantidad = elemento.cantidad -1;
    }else{
        Swal.fire({
            text: 'Esta acción va a quitar el producto del carrito, desea continuar?',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                item_id = this.parentElement.id;
    
                let elemento = carrito.find(element => element.id == item_id);
                let index = carrito.indexOf(elemento);
                if(index > -1){
                    carrito.splice(index, 1);
                }
    
                localStorage.setItem("carrito", JSON.stringify(carrito));
                cargarCarrito();
            }
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    cargarCarrito();
}

function eliminar_item(){
    Swal.fire({
        text: '¿Seguro que desea quitar el producto del carrito?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Aceptar',
        denyButtonText: 'Cancelar'
    }).then((result) => {
        if(result.isConfirmed){
            item_id = this.parentElement.id;

            let elemento = carrito.find(element => element.id == item_id);
            let index = carrito.indexOf(elemento);
            if(index > -1){
                carrito.splice(index, 1);
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            cargarCarrito();
        }
    });
}

function mostrarCarrito(){
    cart_popup.style.display = "block";
}

function ocultarCarrito(){
    cart_popup.style.display = "none";
}

function realizarCompra(){
    if(carrito.length > 0){
        Swal.fire({
            text: '¿Seguro que desea realizar la compra?',
            icon: 'info',
            showDenyButton: true,
            confirmButtonText: 'Aceptar',
            denyButtonText: 'Cancelar'
        }).then((result) => {
            if(result.isConfirmed){
                ocultarCarrito();
                vaciarCarrito();
                Swal.fire({
                    text: '¡Muchas gracias por realizar su compra!',
                    icon: 'success'
                });
            }else{
                Swal.fire({
                    text: 'Vuelva pronto',
                    icon: 'info'
                });
            }
        });
    }else{
        Swal.fire({
            text: 'No hay nada en el carrito',
            icon: 'error'
        });
    }
}