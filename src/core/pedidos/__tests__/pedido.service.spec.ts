import { Test, TestingModule } from '@nestjs/testing';
import { PedidoService } from '../pedidoService';
import PedidosPort from '../pedidoPort';
import { PedidosPortToken } from '../../../interfaces/api/pedidos/pedido-port.token';

describe('PedidoService', () => {
  let pedidoService: PedidoService;
  let mockPedidoPort: jest.Mocked<PedidosPort>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        {
          provide: PedidosPortToken,
          useValue: {
            crearPedidos: jest.fn(),
            obtenerPedidos: jest.fn(),
            obtenerPedidosXusuario: jest.fn(),
            obtenerPedidosXid: jest.fn(),
            delPedido: jest.fn(),
            actualizaPedido: jest.fn(),
          },
        },
      ],
    }).compile();

    pedidoService = module.get<PedidoService>(PedidoService);
    mockPedidoPort = module.get<jest.Mocked<PedidosPort>>(PedidosPortToken);
  });

  it('Debe encontrar un pedido por ID', async () => {
    const mockPedido = { 
      id_pedido: 1, 
      descripcion: "Pedido de prueba", 
      fecha: new Date("2024-03-01"), 
      id: "s@gmail.com",
      estado: "pendiente"
    };

    // Simulamos la respuesta correcta del método obtenerPedidosXid
    mockPedidoPort.obtenerPedidosXid.mockResolvedValue(mockPedido);

    // Llamamos con el ID correcto
    const pedido = await pedidoService.obtenerPedidoXid({ id_pedido: 1 });

    // Validamos la respuesta esperada
    expect(pedido).toEqual(mockPedido);
    expect(mockPedidoPort.obtenerPedidosXid).toHaveBeenCalledWith({ id_pedido: 1 });
  });
});
