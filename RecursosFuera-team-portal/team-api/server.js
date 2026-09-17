const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middlewares
app.use(cors()); // Permite que Angular se conecte
app.use(express.json()); // Permite recibir datos en formato JSON

// Configuración de la conexión a PostgreSQL mediante variables de entorno
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'team_portal_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

// Ruta de prueba para verificar que la API funciona
app.get('/api/status', (req, res) => {
  res.json({ message: '¡API conectada y funcionando!' });
});

// ==========================================
// RUTAS PARA LOS USUARIOS
// ==========================================

// Obtener usuarios 
app.get('/api/users', async (req, res) => {
  try {
    //const result = await pool.query('SELECT id, name, email, role, is_active FROM users');
    const result = await pool.query('SELECT id, name, email, password, role, is_active AS "isActive" FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error ejecutando la consulta', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name, email, password, role]
    );
    res.json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Editar un usuario existente
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5',
      [name, email, password, role, id]
    );
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activar o desactivar un usuario
app.patch('/api/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    await pool.query(
      'UPDATE users SET is_active = $1 WHERE id = $2',
      [isActive, id]
    );
    res.json({ message: 'Estado del usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// RUTAS PARA EL TABLERO DE NOTAS
// ==========================================

// Obtener todas las notas
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, content, status, position_x AS "positionX", position_y AS "positionY" FROM notes'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva nota
app.post('/api/notes', async (req, res) => {
  const { title, content, status, positionX, positionY } = req.body;
  try {
    await pool.query(
      'INSERT INTO notes (title, content, status, position_x, position_y) VALUES ($1, $2, $3, $4, $5)',
      [title, content, status, positionX, positionY]
    );
    res.json({ message: 'Nota creada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una nota (Texto, Estado o su Posición X/Y al arrastrarla)
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, status, positionX, positionY } = req.body;
  try {
    await pool.query(
      'UPDATE notes SET title = $1, content = $2, status = $3, position_x = $4, position_y = $5 WHERE id = $6',
      [title, content, status, positionX, positionY, id]
    );
    res.json({ message: 'Nota actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una nota
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ message: 'Nota eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Levantar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});