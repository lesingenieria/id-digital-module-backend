const { createProfile, getProfileById, updateProfile, deleteProfile } = require('../models/Profile')

const create = async (req, res) => {
  try {
    const profileData = req.body;
    const newProfile = await createProfile(profileData);
    res.status(201).json(newProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el perfil' });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getProfileById(id);
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

// Actualizar perfil
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProfile = await updateProfile(id, updates);
    if (updatedProfile) {
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

// Eliminar perfil
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await deleteProfile(id);
    if (deletedProfile) {
      res.json({ message: 'Perfil eliminado' });
    } else {
      res.status(404).json({ message: 'Perfil no encontrado' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el perfil' });
  }
};

module.exports = {
  create,
  getById,
  update,
  remove,
};
