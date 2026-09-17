const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

// Conexión a la base de datos (igual que nuestra API principal)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'team_portal_db',
  password: process.env.DB_PASSWORD || 'admin',
  port: process.env.DB_PORT || 5432,
});

// ==========================================
// CÓDIGO PURO DE AWS LAMBDA (El "Handler")
// ==========================================
const lambdaHandler = async (event, context) => {
  try {
    // Calculamos las métricas directo en la base de datos
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS "totalNotes",
        COALESCE(SUM(CASE WHEN status = 'Pendiente' THEN 1 ELSE 0 END), 0) AS pending,
        COALESCE(SUM(CASE WHEN status = 'En curso' THEN 1 ELSE 0 END), 0) AS "inProgress",
        COALESCE(SUM(CASE WHEN status = 'Hecho' THEN 1 ELSE 0 END), 0) AS done
      FROM notes
    `);

    const metrics = result.rows[0];

    // Lambda siempre exige retornar 'statusCode' y 'body' en texto
    return {
      statusCode: 200,
      body: JSON.stringify({
        totalNotes: parseInt(metrics.totalNotes),
        pending: parseInt(metrics.pending),
        inProgress: parseInt(metrics.inProgress),
        done: parseInt(metrics.done)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// ==========================================
// EMULADOR LOCAL (Reemplaza a AWS API Gateway)
// ==========================================
app.get('/metrics', async (req, res) => {
  // Simulamos los objetos event y context de AWS
  const event = { httpMethod: req.method, path: req.path };
  const context = {};

  const lambdaResponse = await lambdaHandler(event, context);
  
  res.status(lambdaResponse.statusCode).json(JSON.parse(lambdaResponse.body));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Emulador Lambda corriendo en puerto ${PORT}`));