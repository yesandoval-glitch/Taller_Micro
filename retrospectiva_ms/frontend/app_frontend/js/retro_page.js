/* ── Referencias DOM ────────────────────────────────────── */
const sprintSelector = document.getElementById('sprintSelector');
const retroMeta      = document.getElementById('retroMeta');
const metaFechas     = document.getElementById('metaFechas');
const kanbanBoard    = document.getElementById('kanbanBoard');
const emptyState     = document.getElementById('emptyState');

/* ── Cargar sprints en el selector ──────────────────────── */
const cargarSprints = async () => {
    try {
        const res    = await fetch(`${API_BASE}/sprints`);
        const sprints = await res.json();

        sprintSelector.innerHTML = '<option value="">— Selecciona un sprint —</option>';
        for (const s of sprints) {
            const opt   = document.createElement('option');
            opt.value   = s.id;
            opt.textContent = s.nombre;
            sprintSelector.appendChild(opt);
        }

        // Restaurar selección si viene de index.html
        const guardado = sessionStorage.getItem('sprintSeleccionado');
        if (guardado) {
            sprintSelector.value = guardado;
            sessionStorage.removeItem('sprintSeleccionado');
        }

        manejarCambioSprint(sprints);
    } catch (e) {
        console.error('Error al cargar sprints', e);
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── Cambio de sprint ───────────────────────────────────── */
const manejarCambioSprint = async (sprintsList) => {
    const id = sprintSelector.value;
    if (!id) {
        kanbanBoard.style.display = 'none';
        emptyState.classList.add('visible');
        retroMeta.style.display = 'none';
        return;
    }

    kanbanBoard.style.display = '';
    emptyState.classList.remove('visible');

    // Buscar sprint seleccionado para mostrar fechas
    let lista = sprintsList;
    if (!lista) {
        try {
            const res = await fetch(`${API_BASE}/sprints`);
            lista = await res.json();
        } catch (e) { lista = []; }
    }
    const sprint = lista.find(s => String(s.id) === String(id));
    if (sprint) {
        retroMeta.style.display = 'block';
        metaFechas.textContent  = `${formatFecha(sprint.fecha_inicio)} → ${formatFecha(sprint.fecha_fin)}`;
    }

    await consultarItems(id);
};

sprintSelector.addEventListener('change', () => manejarCambioSprint(null));

/* ── Helper fecha ───────────────────────────────────────── */
const formatFecha = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
};

/* ── Init ───────────────────────────────────────────────── */
kanbanBoard.style.display = 'none';
cargarSprints();
