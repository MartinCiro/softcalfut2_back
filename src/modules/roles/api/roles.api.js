const {
  crearRoles,
  modificarRoles,
  listarRoles,
  deleteRoles
} = require("../controller/roles.controller");
const generic = require("../../generic");

const crearRolesAPI = (req, res) => {
  const {
    nombre,
    descripcion,
    id_permiso,
    permisos
  } = req.body;
  
  return generic.manejarOperacion(req, res, crearRoles, 
    { nombre, descripcion, id_permiso, permisos }, 
    { mensajeError: "Ocurrió un error al crear el rol." }
  );
};

const actualizarRolesAPI = (req, res) => {
  const {
    id, nombre, descripcion, estado, permisos
  } = req.body;
  
  return generic.manejarOperacion(req, res, modificarRoles, 
    { id, nombre, descripcion, estado, permisos }, 
    { mensajeError: "Ocurrió un error al crear el permiso." }
  );
};

/**
 * @param {*} req
 * @param {{}} res
 */
const listarRolesAPI = async (req, res) => {
  const { id } = req.body;
  return generic.manejarOperacion(req, res, listarRoles,
    { id  },
    { mensajeError: "Ocurrió un error al consultar los permisos." }
  );
};

const deleteRolesAPI = async (req, res) => {
  const { id }  = req.body;
  return generic.manejarOperacion(req, res, deleteRoles,
    { id  },
    { mensajeError: "Ocurrió un error al eliminar los permisos." }
  );
};

module.exports = {
  crearRolesAPI,
  actualizarRolesAPI,
  listarRolesAPI,
  deleteRolesAPI
};
