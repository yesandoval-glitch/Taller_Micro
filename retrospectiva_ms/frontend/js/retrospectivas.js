const API_URL = "http://localhost:8000/api/retrospectivas";


// OBTENER RETROSPECTIVAS
async function cargarRetrospectivas() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        mostrarRetrospectivas(data);

    } catch(error) {

        console.log(error);

    }

}


// MOSTRAR
function mostrarRetrospectivas(retrospectivas) {

    const container = document.getElementById(
        "retrospectivas-container"
    );

    container.innerHTML = "";

    retrospectivas.forEach(retro => {

        container.innerHTML += `
        
            <div class="card">

                <h3>${retro.sprint}</h3>

                <p>Fecha: ${retro.fecha}</p>

            </div>

        `;

    });

}


// CREAR
async function crearRetrospectiva() {

    const sprint = document.getElementById("sprint").value;

    const fecha = document.getElementById("fecha").value;


    if(sprint === "" || fecha === "") {

        alert("Completa todos los campos");

        return;

    }

    const nuevaRetrospectiva = {

        sprint,
        fecha

    };

    try {

        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(
                nuevaRetrospectiva
            )

        });

        document.getElementById("sprint").value = "";
        document.getElementById("fecha").value = "";

        cargarRetrospectivas();

    } catch(error) {

        console.log(error);

    }

}


// INICIAR
cargarRetrospectivas();