// --- SELECCIÓN DE ELEMENTOS ---

const agregarGasto = document.querySelector(".agregar-gasto");
const formPopup = document.querySelector(".popup");
const container = document.querySelector(".container");
const cruzPopup = document.querySelector(".cerrar");
const guardarGastoBtn = document.querySelector(".guardar");
const inputDesc = document.querySelector(".input-descripcion");
const inputCate = document.querySelector(".input-categoria");
const inputMonto = document.querySelector(".input-monto");
const inputFecha = document.querySelector(".input-fecha");
const gastosContainer = document.querySelector(".datos");
const btnConfirmarEdicion = document.querySelector(".editar-popup");
const filtroCate = document.querySelector(".filtro-categoria");
const filtroPrecio = document.querySelector(".filtro-precio");


// ----- VARIABLES DE ESTADO -----

let modoEdicion = false;
let idGastoEditando = null;

// -------- FUNCIONES DE UI --------

actualizarEstadoPopup()

// --- FUNCIONES DE NEGOCIO (localstorage, filtros, etc) ---

function obtenerGastosStorage() { return JSON.parse(localStorage.getItem("gastos")) || []}

function guardarGastosStorage(lista) { localStorage.setItem("gastos", JSON.stringify(lista)); }


// ------ FUNCIONES ------

function mensajeEmergente(mensaje, color) {
    const divMensajeItem = document.createElement("div");
    const divPMensaje = document.createElement("p");
    let claseColor = " ";

    if (color === "269546") {
        claseColor = "verde"
    } else {
        claseColor = "rojo"
    }

    divMensajeItem.classList.add(`${claseColor}`);
    divMensajeItem.classList.add("emerge");
    divMensajeItem.classList.add("mensaje-item");
    divPMensaje.classList.add("mensaje-p");
    setTimeout(() => {
        divMensajeItem.classList.remove("emerge");
        divMensajeItem.classList.remove(`${claseColor}`);
    }, 2500);

    divPMensaje.textContent = mensaje;

    divMensajeItem.appendChild(divPMensaje);
    document.body.appendChild(divMensajeItem);
}

function limpiarInputs() {
    inputDesc.value = "";
    inputCate.value = "default";
    inputMonto.value = "";
    inputFecha.value = "";
};

function guardarEdicion(id) {
    let gastos = obtenerGastosStorage()
    if (!validarCampos()) {
        return;
    }

    for (let i = 0; i < gastos.length; i++) {
        if (gastos[i].id == id) {
            gastos[i].descripcion = inputDesc.value;
            gastos[i].categoria = inputCate.value;
            gastos[i].monto = inputMonto.value;
            gastos[i].fecha = inputFecha.value;
        }
    }
    guardarGastosStorage(gastos)
    modoEdicion = false;
    cerrarPopup();
    renderListaGastos();
    limpiarInputs();
    
    mensajeEmergente("GASTO EDITADO CORRECTAMENTE", "269546")
}

function validarCampos() {
    let montoNum = Number(inputMonto.value);

    if (!inputDesc.value.trim()) {
        mensajeEmergente("INGRESE UNA DESCRIPCIÓN", "f00")
        return false;
    } else if (inputCate.value == "default") {
        mensajeEmergente("SELECCIONE UNA CATEGORÍA", "f00")
        return false;
    } else if (isNaN(montoNum) || montoNum <= 0) {
        mensajeEmergente("INGRESE UN MONTO", "f00")
        return false;
    } else if (!inputFecha.value) {
        mensajeEmergente("INGRESE UNA FECHA", "f00")
        return false;
    }

    return true;
};

function actualizarEstadoPopup() {
    if (!modoEdicion) {
        btnConfirmarEdicion.style.opacity = 0;
        btnConfirmarEdicion.style.cursor = "auto";
        guardarGastoBtn.style.opacity = 1;
        guardarGastoBtn.style.cursor = "pointer";
    } else {
        btnConfirmarEdicion.style.opacity = 1;
        btnConfirmarEdicion.style.cursor = "pointer";
        guardarGastoBtn.style.opacity = 0;
        guardarGastoBtn.style.cursor = "auto";
    }
};

function abrirPopup() {
    formPopup.classList.add("popupActivo");
    container.classList.add("containerActivo");
    gastosContainer.classList.add("gastosContainerActivo");
};

function cerrarPopup() {
    formPopup.classList.remove("popupActivo");
    container.classList.remove("containerActivo");
    gastosContainer.classList.remove("gastosContainerActivo");
    limpiarInputs();
};

function eliminarGasto(id) {
    let gastos = obtenerGastosStorage()
    let filtro = gastos.filter(g => g.id !== id);
    guardarGastosStorage(filtro);

    renderListaGastos();

    mensajeEmergente("GASTO ELIMINADO CORRECTAMENTE", "f00")
}

function abrirEdicionGasto(id) {
    let gastos = obtenerGastosStorage();
    modoEdicion = true;
    actualizarEstadoPopup();
    
    abrirPopup();

    let gasto = gastos.find(g => g.id === id);

    if (gasto) {
        inputDesc.value = gasto.descripcion;
        inputCate.value = gasto.categoria;
        inputMonto.value = gasto.monto;
        inputFecha.value = gasto.fecha;

        idGastoEditando = gasto.id
    }
}


function crearMarkupGasto(gasto) {
    const gastoItem = document.createElement("div");
    const gastoInfoContainer = document.createElement("div");
    const botonesContainer = document.createElement("div");
    const descripcionContainer = document.createElement("div");
    const categoriaContainer = document.createElement("div");
    const montoContainer = document.createElement("div");
    const fechaContainer = document.createElement("div");
    const btnEditar = document.createElement("button");
    const btnEliminar = document.createElement("button");
    

    gastoItem.classList.add("padre-gasto");
    gastoItem.id = gasto.id;
    gastoInfoContainer.classList.add("container-gasto");
    descripcionContainer.classList.add("desc-gasto");
    categoriaContainer.classList.add("cate-gasto");
    montoContainer.classList.add("monto-gasto");
    fechaContainer.classList.add("fecha-gasto");
    botonesContainer.classList.add("botones-gasto");
    btnEditar.classList.add("editar-gasto")
    btnEliminar.classList.add("eliminar-gasto")

    descripcionContainer.textContent = gasto.descripcion;
    categoriaContainer.textContent = gasto.categoria;
    montoContainer.textContent = `$ ${gasto.monto} pesos`;
    fechaContainer.textContent = gasto.fecha;
    btnEditar.textContent = "Editar";
    btnEliminar.textContent = "Eliminar";
    

    gastoInfoContainer.appendChild(descripcionContainer);
    gastoInfoContainer.appendChild(categoriaContainer);
    gastoInfoContainer.appendChild(montoContainer);
    gastoInfoContainer.appendChild(fechaContainer);
    botonesContainer.appendChild(btnEditar);
    botonesContainer.appendChild(btnEliminar);
    gastoItem.appendChild(gastoInfoContainer);
    gastoItem.appendChild(botonesContainer);

    return { gastoItem, btnEditar, btnEliminar };
};

function crearElementoGasto(gasto) {
    const { gastoItem, btnEditar, btnEliminar } = crearMarkupGasto(gasto);
    
    btnEliminar.onclick = () => eliminarGasto(gasto.id);
    btnEditar.onclick = () => abrirEdicionGasto(gasto.id);
    gastosContainer.appendChild(gastoItem);
}


function renderListaGastos() {
    gastosContainer.innerHTML = "";
    let gastos = obtenerGastosStorage();
    gastos.forEach(crearElementoGasto);
};


function guardarNuevoGasto() {
    if (!validarCampos()) {
        return;
    };

    let gastos = obtenerGastosStorage();

    gastos.push({
        id: Date.now(),
        descripcion: inputDesc.value,
        categoria: inputCate.value,
        monto: inputMonto.value,
        fecha: inputFecha.value,
    });

    guardarGastosStorage(gastos)
    cerrarPopup();
    renderListaGastos();
    limpiarInputs();
    mensajeEmergente("GASTO CREADO CORRECTAMENTE", "269546");
}



function aplicarFiltros() {
    let gastos = obtenerGastosStorage();
    let copiaMaster = [...gastos];
    gastosContainer.innerHTML = "";

    let valueCate = filtroCate.value;
    let valuePrecio = filtroPrecio.value;

    if (valueCate !== "default") {
        copiaMaster = copiaMaster.filter(gasto => gasto.categoria === valueCate);
    }

    if (valuePrecio == "Mayor") {
        copiaMaster.sort((a, b) => Number(b.monto) - Number(a.monto));
    } else if (valuePrecio == "Menor") {
        copiaMaster.sort((a, b) => Number(a.monto) - Number(b.monto));
    }

    copiaMaster.forEach(crearElementoGasto);
}


// ------------ EVENTOS ------------

btnConfirmarEdicion.addEventListener("click", () => {
    if (modoEdicion && idGastoEditando) {
        guardarEdicion(idGastoEditando);
        idGastoEditando = null;
        modoEdicion = false;
    }
    actualizarEstadoPopup();
});

agregarGasto.addEventListener("click", () => {
    abrirPopup();
});

formPopup.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!modoEdicion) {
        guardarNuevoGasto();
    }
});

cruzPopup.addEventListener("click", () => {
    cerrarPopup();
    modoEdicion = false;
    actualizarEstadoPopup();
});

filtroCate.addEventListener("change", () => {
    aplicarFiltros();
});

filtroPrecio.addEventListener("change", () => {
    aplicarFiltros();
});


renderListaGastos();