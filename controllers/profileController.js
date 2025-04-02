const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");

const {
  createProfile,
  getProfileById,
  updateProfile,
  deleteProfile,
  updatePassword
} = require("../models/Profile");
const bcrypt = require("bcryptjs");

const create = async (req, res) => {
  try {
    const profileData = req.body;
    if (!profileData.password) {
      return res.status(400).json({ message: "Se requiere contraseña" });
    }
    if (!profileData.email) {
      return res.status(400).json({ message: "Se requiere email" });
    }
    profileData.id_uuid = uuidv4();

    const hashedPassword = await bcrypt.hash(profileData.password, 10);
    profileData.password = hashedPassword;
    const newProfile = await createProfile(profileData);
    delete newProfile.password;
    res.status(201).json(newProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear el perfil" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await getProfileById(id);
    if (profile) {
      delete profile.password;
      res.json(profile);
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

// Actualizar perfil
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedProfile = await updateProfile(id, updates);
    if (updatedProfile) {
      delete updateProfile.password;
      res.json(updatedProfile);
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el perfil." });
  }
};

// Eliminar perfil
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProfile = await deleteProfile(id);
    if (deletedProfile) {
      delete deletedProfile.password;
      res.json({ message: "Perfil eliminado" });
    } else {
      res.status(404).json({ message: "Perfil no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el perfil" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, password } = req.body;

    if (!currentPassword || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const profile = await getProfileById(userId);

    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const isMatch = await bcrypt.compare(currentPassword, profile.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    await updatePassword(userId, hashedPassword);

    res.clearCookie("token");

    return res.json({ message: "Contraseña actualizada con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar la contraseña" });
  }
};
module.exports = {
  create,
  getById,
  update,
  remove,
  changePassword,
};
