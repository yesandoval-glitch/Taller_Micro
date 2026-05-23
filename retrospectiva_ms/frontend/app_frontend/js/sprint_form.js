/* ── Referencias DOM ────────────────────────────────────── */
const inputNombre = document.getElementById('sprintNombre');
const inputInicio = document.getElementById('sprintInicio');
const inputFin    = document.getElementById('sprintFin');
const btnGuardar  = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle   = document.getElementById('formTitle');

const errNombre = document.getElementById('errNombre');
const errInicio = document.getElementById('errInicio');
const errFin    = document.getElementById('errFin');

let modoEdicion    = false;
let idEnEdicion    = null;

/* ── Leer form ──────────────────────────────────────────── */
const getFormData = () => ({
    nombre:       inputNombre.value.trim(),
    fecha_inicio: inputInicio.value,
    fecha_fin:    inputFin.value,
});

/* ── Llenar form (edición) ──────────────────────────────── */
const editarSprint = (s) => {
    modoEdicion     = true;
    idEnEdicion     = s.id;
    formTitle.textContent = 'Editar Sprint';
    btnGuardar.textContent = 'Actualizar';
    inputNombre.value = s.nombre;
    inputInicio.value = s.fecha_inicio;
    inputFin.value    = s.fecha_fin;
    limpiarErrores();
    inputNombre.focus();
};

/* ── Resetear form ──────────────────────────────────────── */
const resetForm = () => {
    modoEdicion = false;
    idEnEdicion = null;
    formTitle.textContent  = 'Nuevo Sprint';
    btnGuardar.textContent = 'Guardar Sprint';
    inputNombre.value = '';
    inputInicio.value = '';
    inputFin.value    = '';
    limpiarErrores();
};

/* ── Validar ────────────────────────────────────────────── */
const validar = (data) => {
    let ok = true;
    errNombre.classList.toggle('hidden', !!data.nombre);
    errInicio.classList.toggle('hidden', !!data.fecha_inicio);
    errFin.classList.toggle('hidden', !!data.fecha_fin);
    if (!data.nombre || !data.fecha_inicio || !data.fecha_fin) ok = false;
    return ok;
};

const limpiarErrores = () => {
    errNombre.classList.add('hidden');
    errInicio.classList.add('hidden');
    errFin.classList.add('hidden');
};

/* ── API: crear ─────────────────────────────────────────── */
const crearSprint = async (data) => {
    try {
        const res = await fetch(`${API_BASE}/sprints`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        });
        if (res.status === 201) {
            showModal('Sprint creado correctamente');
            resetForm();
            await consultarSprints();
        } else {
            showModal('No se pudo crear el sprint', 'error');
        }
    } catch (e) {
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── API: actualizar ────────────────────────────────────── */
const actualizarSprint = async (id, data) => {
    try {
        const res = await fetch(`${API_BASE}/sprints/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        });
        if (res.ok) {
            showModal('Sprint actualizado');
            resetForm();
            await consultarSprints();
        } else {
            showModal('No se pudo actualizar el sprint', 'error');
        }
    } catch (e) {
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── Eventos ────────────────────────────────────────────── */
btnGuardar.addEventListener('click', () => {
    const data = getFormData();
    if (!validar(data)) return;
    modoEdicion ? actualizarSprint(idEnEdicion, data) : crearSprint(data);
});

btnCancelar.addEventListener('click', resetForm);

inputNombre.addEventListener('input', () => {
    if (inputNombre.value.trim()) errNombre.classList.add('hidden');
});
