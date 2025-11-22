package com.proyecto.lafrance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.proyecto.lafrance.dto.DireccionDTO;
import com.proyecto.lafrance.dto.PedidoRequest;
import com.proyecto.lafrance.dto.DetalleDTO;
import com.proyecto.lafrance.model.DetallePedido;
import com.proyecto.lafrance.model.Pedido;
import com.proyecto.lafrance.model.Producto;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.PedidoRepository;
import com.proyecto.lafrance.repository.ProductoRepository;
import com.proyecto.lafrance.repository.UsuarioRepository;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Paso 1: Crear pedido desde el carrito
    public Pedido crearPedidoDesdeRequest(Usuario usuario, PedidoRequest req) {
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha_pedido(LocalDate.now());
        pedido.setEstado("Carrito");

        double total = agregarDetalles(pedido, req.getDetalles());
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    // Paso 2: Confirmar pedido
    public Pedido confirmarPedido(String correo, PedidoRequest req) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha_pedido(LocalDate.now());
        pedido.setEstado("Pendiente");
        pedido.setDireccion(req.getDireccion());
        pedido.setReferencia(req.getReferencia());
        pedido.setLat(req.getLat());
        pedido.setLng(req.getLng());

        double total = agregarDetalles(pedido, req.getDetalles());
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    private double agregarDetalles(Pedido pedido, List<DetalleDTO> detalles) {
        double total = 0;
        for (DetalleDTO det : detalles) {   // ✅ usar el parámetro correcto
            DetallePedido dp = new DetallePedido();
            dp.setPedido(pedido);
            dp.setCantidad(det.getCantidad());
            dp.setPrecio_unitario(det.getPrecio());

            // Buscar el producto en BD usando el productoId
            Producto producto = productoRepository.findById(det.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            dp.setProducto(producto);

            total += det.getCantidad() * det.getPrecio();
            pedido.getDetalles().add(dp);
        }
        return total;
    }
}