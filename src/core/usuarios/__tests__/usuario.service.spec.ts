import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from '../usuarioService';
import UsuariosPort  from '../usuarioPort';
import { UsuariosPortToken } from '../../../interfaces/api/usuarios/usuario-port.token';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let mockUsuarioPort: jest.Mocked<UsuariosPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
            provide: UsuariosPortToken,
          useValue: {
            crearUsuarios: jest.fn(),
            obtenerUsuarios: jest.fn(),
            obtenerUsuariosXid: jest.fn(),
            delUsuario: jest.fn(),
            actualizaUsuario: jest.fn(),
          },
        },
      ],
    }).compile();

    usuarioService = module.get<UsuarioService>(UsuarioService);
    mockUsuarioPort = module.get<jest.Mocked<UsuariosPort>>(UsuariosPortToken);
  });

  it('Debe encontrar un usuario por id', async () => {
    const mockUser = { id: 1, nombres: "Ciro", id: "s@gmail.com" };

    // El método espera un objeto con `{ id }`
    mockUsuarioPort.obtenerUsuariosXid.mockResolvedValue(mockUser);

    // Llamar con el objeto correcto
    const usuario = await usuarioService.obtenerUsuarioXid({ id: "s@gmail.com" });

    expect(usuario).toEqual(mockUser);
    expect(mockUsuarioPort.obtenerUsuariosXid).toHaveBeenCalledWith({ id: "s@gmail.com" });
  });
});
