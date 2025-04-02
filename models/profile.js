const pool = require("../config/db");

// Crear perfil
async function createProfile({
  name,
  job_title,
  company,
  email,
  phone,
  socials,
  profile_picture,
  visibility,
  password,
  id_uuid
}) {
  const query = `
    INSERT INTO profiles (name, job_title, company, email, phone, socials, profile_picture, visibility, password, id_uuid)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
    name,
    job_title,
    company,
    email,
    phone,
    JSON.stringify(socials),
    profile_picture,
    JSON.stringify(visibility),
    password,
    id_uuid
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Obtener perfil por ID
async function getProfileById(id_uuid) {
  const query = `SELECT * FROM profiles WHERE id_uuid = $1;`;
  const { rows } = await pool.query(query, [id_uuid]);
  return rows[0];
}

// Actualizar perfil
async function updateProfile(id_uuid, updates) {
  if (updates.password) {
    throw new Error(
      "La contraseña no puede ser actualizada"
    );
  }

  if (updates.role){
    throw new Error("No puedes modificar los permisos")
  }

  if (updates.email){
    throw new Error("No puedes modificar el email")
  }

  const fields = Object.keys(updates)
    .map((key, i) => `${key} = $${i + 2}`)
    .join(", ");
  const values = [id_uuid, ...Object.values(updates)];
  const query = `UPDATE profiles SET ${fields} WHERE id_uuid = $1 RETURNING *;`;
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Eliminar perfil
async function deleteProfile(id_uuid) {
  const query = `DELETE FROM profiles WHERE id_uuid = $1 RETURNING *;`;
  const { rows } = await pool.query(query, [id_uuid]);
  return rows[0];
}

const getProfileByEmail = async (email) => {
  try {
    const query = "SELECT * FROM profiles WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0]; // Retorna el primer registro que coincida, o undefined si no se encuentra
  } catch (err) {
    throw err;
  }
};

const updatePassword = async (userId, hashedPassword) => {
    await pool.query("UPDATE profiles SET password = $1 WHERE id_uuid = $2", [hashedPassword, userId]);
};

module.exports = {
  createProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  getProfileByEmail,
  updatePassword
};
