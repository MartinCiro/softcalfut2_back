const {
  crearEquipos,
  modificarEquipos,
  listarEquipos,
  deleteEquipos
} = require("../controller/equipos.controller");
const generic = require("../../generic");

const crearEquiposAPI = (req, res) => {
  const { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p } = req.body;
  
  return generic.manejarOperacion(req, res, crearEquipos, 
    { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p }, 
    { mensajeError: "Ocurrió un error al crear el usuario." }
  );
};

const actualizarEquiposAPI = (req, res) => {
  const {
    user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p
  } = req.body;
  
  return generic.manejarOperacion(req, res, modificarEquipos, 
    { user, pass, id_rol, status, nombre, apellidos, numero_documento, correo, numero_contacto, fecha_nacimiento, info_p }, 
    { mensajeError: "Ocurrió un error al crear el usuario." }
  );
};

/**
 * @param {*} req
 * @param {{}} res
 */
const listarEquiposAPI = async (req, res) => {
  const { nombre_equipo, documento } = req.body;
  return generic.manejarOperacion(req, res, listarEquipos,
    { nombre_equipo, documento  },
    { mensajeError: "Ocurrió un error al consultar los usuarios." }
  );
};

const deleteEquiposAPI = async (req, res) => {
  const { id }  = req.body;
  return generic.manejarOperacion(req, res, deleteEquipos,
    { id  },
    { mensajeError: "Ocurrió un error al eliminar los usuarios." }
  );
};

module.exports = {
  crearEquiposAPI,
  actualizarEquiposAPI,
  listarEquiposAPI,
  deleteEquiposAPI
};
