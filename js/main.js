document.addEventListener('DOMContentLoaded', () => {
    
    // Referencias a elementos
    const selectBodega = document.getElementById('bodega');
    const selectSucursal = document.getElementById('sucursal');
    const selectMoneda = document.getElementById('moneda');
    const containerMateriales = document.getElementById('materiales-container');
    const btnGuardar = document.getElementById('btnGuardar');
    const mensajeDiv = document.getElementById('mensaje');

    // Cargar datos iniciales
    cargarBodegas();
    cargarMonedas();
    cargarMateriales();

    // Eventos
    selectBodega.addEventListener('change', () => {
        const idBodega = selectBodega.value;
        if (idBodega) {
            cargarSucursales(idBodega);
        } else {
            selectSucursal.innerHTML = '<option value=""></option>';
            selectSucursal.disabled = true;
        }
    });

    btnGuardar.addEventListener('click', () => {
        if (validarFormulario()) {
            guardarProducto();
        }
    });

    // Funciones AJAX para cargar selects
    function cargarBodegas() {
        fetch('php/get_bodegas.php')
            .then(response => response.json())
            .then(res => {
                if(res.status === 'success') {
                    res.data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = item.nombre;
                        selectBodega.appendChild(option);
                    });
                }
            })
            .catch(error => console.error("Error al cargar bodegas:", error));
    }

    function cargarSucursales(idBodega) {
        selectSucursal.innerHTML = '<option value=""></option>';
        selectSucursal.disabled = true;

        fetch(`php/get_sucursales.php?id_bodega=${idBodega}`)
            .then(response => response.json())
            .then(res => {
                if(res.status === 'success') {
                    res.data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = item.nombre;
                        selectSucursal.appendChild(option);
                    });
                    selectSucursal.disabled = false;
                }
            })
            .catch(error => console.error("Error al cargar sucursales:", error));
    }

    function cargarMonedas() {
        fetch('php/get_monedas.php')
            .then(response => response.json())
            .then(res => {
                if(res.status === 'success') {
                    res.data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = `${item.simbolo} - ${item.nombre}`;
                        selectMoneda.appendChild(option);
                    });
                }
            })
            .catch(error => console.error("Error al cargar monedas:", error));
    }

    function cargarMateriales() {
        fetch('php/get_materiales.php')
            .then(response => response.json())
            .then(res => {
                if(res.status === 'success') {
                    res.data.forEach(item => {
                        const label = document.createElement('label');
                        label.className = 'checkbox-item';
                        
                        const input = document.createElement('input');
                        input.type = 'checkbox';
                        input.name = 'materiales[]';
                        input.value = item.id;

                        label.appendChild(input);
                        label.appendChild(document.createTextNode(item.nombre));

                        containerMateriales.appendChild(label);
                    });
                }
            })
            .catch(error => console.error("Error al cargar materiales:", error));
    }

    // Validación principal
    function validarFormulario() {
        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const bodega = document.getElementById('bodega').value;
        const sucursal = document.getElementById('sucursal').value;
        const moneda = document.getElementById('moneda').value;
        const precio = document.getElementById('precio').value.trim();
        const descripcion = document.getElementById('descripcion').value.trim();
        
        const checkboxesMateriales = document.querySelectorAll('input[name="materiales[]"]:checked');
        
        // Validación Código
        if (codigo === "") {
            alert("El código del producto no puede estar en blanco.");
            return false;
        }
        if (codigo.length < 5 || codigo.length > 15) {
            alert("El código del producto debe tener entre 5 y 15 caracteres.");
            return false;
        }
        const regexCodigo = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
        if (!regexCodigo.test(codigo)) {
            alert("El código del producto debe contener letras y números");
            return false;
        }

        // Validación Nombre
        if (nombre === "") {
            alert("El nombre del producto no puede estar en blanco.");
            return false;
        }
        if (nombre.length < 2 || nombre.length > 50) {
            alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
            return false;
        }

        // Validación Bodega y Sucursal
        if (bodega === "") {
            alert("Debe seleccionar una bodega.");
            return false;
        }
        if (sucursal === "") {
            alert("Debe seleccionar una sucursal para la bodega seleccionada.");
            return false;
        }

        // Validación Moneda
        if (moneda === "") {
            alert("Debe seleccionar una moneda para el producto.");
            return false;
        }

        // Validación Precio
        if (precio === "") {
            alert("El precio del producto no puede estar en blanco.");
            return false;
        }
        const regexPrecio = /^\d+(\.\d{1,2})?$/;
        if (!regexPrecio.test(precio) || parseFloat(precio) <= 0) {
            alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
            return false;
        }

        // Validación Materiales
        if (checkboxesMateriales.length < 2) {
            alert("Debe seleccionar al menos dos materiales para el producto.");
            return false;
        }

        // Validación Descripción
        if (descripcion === "") {
            alert("La descripción del producto no puede estar en blanco.");
            return false;
        }
        if (descripcion.length < 10 || descripcion.length > 1000) {
            alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
            return false;
        }

        return true;
    }

    // Envío del formulario
    async function guardarProducto() {
        const codigo = document.getElementById('codigo').value.trim();
        
        // Verificar existencia del código primero
        try {
            const respCheck = await fetch(`php/check_codigo.php?codigo=${encodeURIComponent(codigo)}`);
            const dataCheck = await respCheck.json();
            
            if (dataCheck.status === 'success' && dataCheck.existe) {
                alert("El código del producto ya está registrado.");
                return;
            }
        } catch (error) {
            mostrarMensaje("Error al verificar el código.", "error");
            return;
        }

        // Preparar datos
        const materialesSeleccionados = Array.from(document.querySelectorAll('input[name="materiales[]"]:checked')).map(cb => cb.value);
        
        const payload = {
            codigo: codigo,
            nombre: document.getElementById('nombre').value.trim(),
            bodega: document.getElementById('bodega').value,
            sucursal: document.getElementById('sucursal').value,
            moneda: document.getElementById('moneda').value,
            precio: document.getElementById('precio').value.trim(),
            materiales: materialesSeleccionados,
            descripcion: document.getElementById('descripcion').value.trim()
        };

        // Enviar al servidor
        btnGuardar.disabled = true;
        btnGuardar.textContent = "Guardando...";

        fetch('php/save_producto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                mostrarMensaje("Producto guardado exitosamente.", "success");
                document.getElementById('formProducto').reset();
                selectSucursal.innerHTML = '<option value=""></option>';
                selectSucursal.disabled = true;
            } else {
                mostrarMensaje(data.message || "Error al guardar el producto.", "error");
            }
        })
        .catch(error => {
            console.error(error);
            mostrarMensaje("Ocurrió un error en el servidor.", "error");
        })
        .finally(() => {
            btnGuardar.disabled = false;
            btnGuardar.textContent = "Guardar Producto";
        });
    }

    function mostrarMensaje(texto, tipo) {
        mensajeDiv.textContent = texto;
        mensajeDiv.className = `mensaje ${tipo}`;
        setTimeout(() => {
            mensajeDiv.style.display = 'none';
        }, 5000);
    }

});
