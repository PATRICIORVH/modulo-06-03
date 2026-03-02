async function cargarProductos() {

    const res = await fetch('/productos');
    const productos = await res.json();

    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    productos
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.nombre} - $${p.precio}`;
            lista.appendChild(li);
        });
}

async function agregarProducto() {

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;

    if (!nombre || !precio) {
        alert("Completa todos los campos");
        return;
    }

    try {
        const res = await fetch('/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, precio })
        });

        const data = await res.json();

        console.log(data);   // 👈 AHORA APARECERÁ EN CONSOLE
        alert(data.mensaje);

        // limpiar inputs
        document.getElementById('nombre').value = '';
        document.getElementById('precio').value = '';

        // recargar lista
        cargarProductos();

    } catch (error) {
        console.error("Error:", error);
        alert("Error al agregar producto");
    }
}

app.use((req, res) => {
    res.status(405).json({ error: 'Método no permitido' });
});