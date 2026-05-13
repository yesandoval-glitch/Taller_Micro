const API_ACCIONES = "http://localhost:8000/api/acciones";


// CARGAR ACCIONES
async function cargarAcciones() {

    try {

        const response = await fetch(API_ACCIONES);

        const data = await response.json();

        mostrarAcciones(data);

    } catch(error) {

        console.log(error);

    }

}


// MOSTRAR ACCIONES
function mostrarAcciones(acciones) {

    const container = document.getElementById(
        "acciones-container"
    );

    if(!container) return;

    container.innerHTML = "";

    acciones.forEach(accion => {

        container.innerHTML += `
        
            <div class="card">

                <h3>${accion.descripcion}</h3>

                <p>
                    Estado:
                    ${
                        accion.cumplida == 1
                        ? "✅ Cumplida"
                        : "❌ Pendiente"
                    }
                </p>

            </div>

        `;

    });

}


// CREAR ACCIÓN
async function crearAccion() {

    const descripcion = document.getElementById(
        "descripcionAccion"
    ).value;

    const retrospectiva_id = document.getElementById(
        "retrospectivaId"
    ).value;


    if(descripcion === "") {

        alert("Escribe una acción");

        return;

    }

    const accion = {

        descripcion,
        cumplida: false,
        retrospectiva_id

    };

    try {

        await fetch(API_ACCIONES, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(accion)

        });

        cerrarModal();

        cargarAcciones();

    } catch(error) {

        console.log(error);

    }

}