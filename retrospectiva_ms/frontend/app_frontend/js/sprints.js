/* ── Config ─────────────────────────────────────────────── */
const API_BASE = 'http://127.0.0.1:8000';

/* ── Estado ─────────────────────────────────────────────── */
const sprints     = [];
let   sprintActivo = null;

/* ── Referencias DOM ────────────────────────────────────── */
const sprintsTB    = document.getElementById('sprintsTB');
const sprintCount  = document.getElementById('sprintCount');

/* ── Render tabla ───────────────────────────────────────── */
const renderSprints = () => {
    const tbody = sprintsTB.querySelector('tbody');
    tbody.innerHTML = '';
    sprintCount.textContent = sprints.length;

    if (sprints.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="4">No hay sprints registrados aún.</td></tr>';
        return;
    }

    for (const s of sprints) {
        const tr = document.createElement('tr');

        const tdNombre = document.createElement('td');
        tdNombre.innerHTML = `<span class="sprint-name">${s.nombre}</span>`;

        const tdInicio = document.createElement('td');
        tdInicio.className = 'date-cell';
        tdInicio.textContent = formatDate(s.fecha_inicio);

        const tdFin = document.createElement('td');
        tdFin.className = 'date-cell';
        tdFin.textContent = formatDate(s.fecha_fin);

        const tdAcciones = document.createElement('td');
        tdAcciones.innerHTML = `<div class="row-actions"></div>`;
        const actWrap = tdAcciones.querySelector('.row-actions');

        const btnRetro = document.createElement('button');
        btnRetro.className = 'action-btn action-btn--retro';
        btnRetro.textContent = 'Ver retro';
        btnRetro.addEventListener('click', () => irARetro(s.id));

        const btnEditar = document.createElement('button');
        btnEditar.className = 'action-btn action-btn--edit';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarSprint(s));

        const btnBorrar = document.createElement('button');
        btnBorrar.className = 'action-btn action-btn--delete';
        btnBorrar.textContent = 'Eliminar';
        btnBorrar.addEventListener('click', () => borrarSprint(s.id));

        actWrap.appendChild(btnRetro);
        actWrap.appendChild(btnEditar);
        actWrap.appendChild(btnBorrar);

        tr.appendChild(tdNombre);
        tr.appendChild(tdInicio);
        tr.appendChild(tdFin);
        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    }
};

/* ── API calls ──────────────────────────────────────────── */
const consultarSprints = async () => {
    try {
        const res  = await fetch(`${API_BASE}/sprints`);
        const data = await res.json();
        sprints.splice(0, sprints.length, ...data);
        renderSprints();
    } catch (e) {
        console.error('Error al consultar sprints', e);
        showModal('Error al conectar con el servidor', 'error');
    }
};

const borrarSprint = async (id) => {
    if (!confirm('¿Eliminar este sprint y todos sus items?')) return;
    try {
        const res = await fetch(`${API_BASE}/sprints/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showModal('Sprint eliminado');
            await consultarSprints();
        } else {
            showModal('No se pudo eliminar el sprint', 'error');
        }
    } catch (e) {
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── Navegación a retrospectiva ─────────────────────────── */
const irARetro = (id) => {
    sessionStorage.setItem('sprintSeleccionado', id);
    window.location.href = 'retrospectiva.html';
};

/* ── Helpers ────────────────────────────────────────────── */
const formatDate = (iso) => {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
};

/* ── Init ───────────────────────────────────────────────── */
consultarSprints();
