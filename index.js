const express = require('express');
const fs = require('fs/promises');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const ARCHIVO = 'productos.txt';

/* ---------------- GET ---------------- */
app.get('/productos', async (req, res) => {
    try {
        const data = await fs.readFile(ARCHIVO, 'utf8');

        const productos = data
            .trim()
            .split('\n')
            .map(linea => {
                const [nombre, precio] = linea.split(',');
                return { nombre, precio: Number(precio) };
            });

        res.json(productos);

    } catch (error) {
        res.status(500).json({ error: 'No se pudo leer el archivo' });
    }
});

/* ---------------- POST ---------------- */
app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio } = req.body;

        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const nuevaLinea = `\n${nombre},${precio}`;
        await fs.appendFile(ARCHIVO, nuevaLinea);

        res.status(201).json({ mensaje: 'Producto agregado correctamente' });

    } catch (error) {
        res.status(500).json({ error: 'No se pudo guardar el producto' });
    }
});

app.listen(3000, () => {
    console.log('Servidor funcionando en http://localhost:3000');
});