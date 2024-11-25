const {
  crearUsuarios,
  modificarUsuarios,
  listarUsuarios,
  deleteUsuarios
} = require("../controller/usuarios.controller");
const generic = require("../../generic");

const crearUsuariosAPI = (req, res) => {
  const { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = req.body;
  
  return generic.manejarOperacion(req, res, crearUsuarios, 
    { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p }, 
    { mensajeError: "Ocurrió un error al crear el usuario." }
  );
};

const actualizarUsuariosAPI = (req, res) => {
  const {
    user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p
  } = req.body;
  
  return generic.manejarOperacion(req, res, modificarUsuarios, 
    { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p }, 
    { mensajeError: "Ocurrió un error al crear el usuario." }
  );
};

/**
 * @param {*} req
 * @param {{}} res
 */
const listarUsuariosAPI = async (req, res) => {
  const { documento } = req.body;
  return generic.manejarOperacion(req, res, listarUsuarios,
    { documento  },
    { mensajeError: "Ocurrió un error al consultar los usuarios." }
  );
};

const deleteUsuariosAPI = async (req, res) => {
  const { id }  = req.body;
  return generic.manejarOperacion(req, res, deleteUsuarios,
    { id  },
    { mensajeError: "Ocurrió un error al eliminar los usuarios." }
  );
};

module.exports = {
  crearUsuariosAPI,
  actualizarUsuariosAPI,
  listarUsuariosAPI,
  deleteUsuariosAPI
};
