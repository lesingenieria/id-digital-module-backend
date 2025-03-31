const pool = require('../config/db');

// Crear perfil
async function createProfile({ name, job_title, company, email, phone, socials, profile_picture, visibility }) {
  const query = `
    INSERT INTO profiles (name, job_title, company, email, phone, socials, profile_picture, visibility)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [name, job_title, company, email, phone, JSON.stringify(socials), profile_picture, JSON.stringify(visibility)];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Obtener perfil por ID
async function getProfileById(id) {
  const query = `SELECT * FROM profiles WHERE id = $1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

// Actualizar perfil
async function updateProfile(id, updates) {
  const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(", ");
  const values = [id, ...Object.values(updates)];
  const query = `UPDATE profiles SET ${fields} WHERE id = $1 RETURNING *;`;
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Eliminar perfil
async function deleteProfile(id) {
  const query = `DELETE FROM profiles WHERE id = $1 RETURNING *;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

module.exports = {
  createProfile,
  getProfileById,
  updateProfile,
  deleteProfile
};
