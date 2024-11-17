const {
  crearPermisos,
  modificarPermisos,
  listarPermisos,
  deletePermisos
} = require("../controller/permisos.controller");
const generic = require("../../generic");
const ResponseBody = require("../../../shared/model/ResponseBody.model");

const crearPermisosAPI = (req, res) => {
  const {
    nombre,
    descripcion
  } = req.body;
  
  return generic.manejarOperacion(req, res, crearPermisos, 
    { nombre, descripcion }, 
    { mensajeError: "Ocurrió un error al crear el permiso." }
  );
};

const actualizarPermisosAPI = (req, res) => {
  const {
    id, nombre, descripcion, estado
  } = req.body;
  
  return generic.manejarOperacion(req, res, modificarPermisos, 
    { id, nombre, descripcion, estado }, 
    { mensajeError: "Ocurrió un error al crear el permiso." }
  );
};

/**
 * @param {*} req
 * @param {{}} res
 */
const listarPermisosAPI = async (req, res) => {
  const { id } = req.body;
  return generic.manejarOperacion(req, res, listarPermisos,
    { id  },
    { mensajeError: "Ocurrió un error al consultar los permisos." }
  );
};

const deletePermisosAPI = async (req, res) => {
  const { id }  = req.body;
  return generic.manejarOperacion(req, res, deletePermisos,
    { id  },
    { mensajeError: "Ocurrió un error al eliminar los permisos." }
  );
};

module.exports = {
  crearPermisosAPI,
  actualizarPermisosAPI,
  listarPermisosAPI,
  deletePermisosAPI
};
