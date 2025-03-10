function iniciarApp() {
    const resultado = document.querySelector('#resultado');
    const selectCategorias = document.querySelector('#categorias');

    if (selectCategorias) {
        selectCategorias.addEventListener('change', seleccionarCategoria);
        cargarCategoriasIoT();
    }

    const favoritosDiv = document.querySelector('.favoritos');
    if (favoritosDiv) {
        obtenerFavoritos();
    }

    const modal = new bootstrap.Modal('#modal', {});

    function cargarCategoriasIoT() {
        const categorias = ['Humo', 'Gas', 'Fuego'];
        categorias.forEach(categoria => {
            const option = document.createElement('OPTION');
            option.value = categoria;
            option.textContent = categoria;
            selectCategorias.appendChild(option);
        });
    }

    function seleccionarCategoria(e) {
        const categoria = e.target.value;
        simularDatosIoT(categoria);
    }

    function simularDatosIoT(categoria) {
        const datosSimulados = [
            {
                id: '1',
                tipo: categoria,
                nivel: Math.floor(Math.random() * 100),
                ubicacion: 'Planta Baja',
                fecha: new Date().toLocaleString()
            },
            {
                id: '2',
                tipo: categoria,
                nivel: Math.floor(Math.random() * 100),
                ubicacion: 'Segundo Piso',
                fecha: new Date().toLocaleString()
            }
        ];
        mostrarAlertas(datosSimulados);
    }

    function mostrarAlertas(alertas = []) {
        limpiarHtml(resultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = alertas.length ? 'Alertas Detectadas' : 'No hay Alertas';
        resultado.appendChild(heading);

        alertas.forEach(alerta => {
            const { id, tipo, nivel, ubicacion, fecha } = alerta;

            const alertaContenedor = document.createElement('DIV');
            alertaContenedor.classList.add('col-md-4');

            const alertaCard = document.createElement('DIV');
            alertaCard.classList.add('card', 'mb-4');

            const alertaBody = document.createElement('DIV');
            alertaBody.classList.add('card-body');

            const alertaHeading = document.createElement('H3');
            alertaHeading.classList.add('card-title', 'mb-3');
            alertaHeading.textContent = `Alerta de ${tipo}`;

            const alertaUbicacion = document.createElement('P');
            alertaUbicacion.textContent = `Ubicación: ${ubicacion}`;

            const alertaNivel = document.createElement('P');
            alertaNivel.textContent = `Nivel Detectado: ${nivel}%`;

            const alertaFecha = document.createElement('P');
            alertaFecha.textContent = `Fecha: ${fecha}`;

            const alertaButton = document.createElement('BUTTON');
            alertaButton.classList.add('btn', 'btn-danger', 'w-100');
            alertaButton.textContent = 'Ver Detalles';
            alertaButton.onclick = function () {
                mostrarAlertaModal(alerta);
            };

            alertaBody.appendChild(alertaHeading);
            alertaBody.appendChild(alertaUbicacion);
            alertaBody.appendChild(alertaNivel);
            alertaBody.appendChild(alertaFecha);
            alertaBody.appendChild(alertaButton);

            alertaCard.appendChild(alertaBody);
            alertaContenedor.appendChild(alertaCard);

            resultado.appendChild(alertaContenedor);
        });
    }

    function mostrarAlertaModal(alerta) {
        const { id, tipo, nivel, ubicacion, fecha } = alerta;

        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = `Detalles de Alerta de ${tipo}`;
        modalBody.innerHTML = `
            <p><strong>Ubicación:</strong> ${ubicacion}</p>
            <p><strong>Nivel Detectado:</strong> ${nivel}%</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
        `;

        const modalFooter = document.querySelector('.modal-footer');
        limpiarHtml(modalFooter);

        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('btn', 'btn-danger', 'col');
        btnFavorito.textContent = existeStorage(id) ? 'Eliminar de Favoritos' : 'Marcar como Importante';

        btnFavorito.onclick = function () {
            if (existeStorage(id)) {
                eliminarFavorito(id);
                btnFavorito.textContent = 'Marcar como Importante';
                mostrarToast('Eliminado de Favoritos');
                return;
            }

            agregarFavorito(alerta);
            btnFavorito.textContent = 'Eliminar de Favoritos';
            mostrarToast('Marcado como Importante');
        };

        const btnCerrarModal = document.createElement('BUTTON');
        btnCerrarModal.classList.add('btn', 'btn-secondary', 'col');
        btnCerrarModal.textContent = 'Cerrar';
        btnCerrarModal.onclick = function () {
            modal.hide();
        };

        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);

        modal.show();
    }

    function agregarFavorito(alerta) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        localStorage.setItem('favoritos', JSON.stringify([...favoritos, alerta]));
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nuevosFavoritos = favoritos.filter(favorito => favorito.id !== id);
        localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
    }

    function existeStorage(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    }

    function mostrarToast(mensaje) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show();
    }

    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        if (favoritos.length) {
            mostrarAlertas(favoritos);
            return;
        }

        const noFavoritos = document.createElement('P');
        noFavoritos.textContent = 'No hay alertas importantes aún';
        noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        favoritosDiv.appendChild(noFavoritos);
    }

    function limpiarHtml(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);
