package com.proyecto.lafrance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
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

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // -----------------------------
    //   1) Crear pedido (carrito)
    // -----------------------------
    public Pedido crearPedidoDesdeRequest(Usuario usuario, PedidoRequest req) {

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha_pedido(LocalDate.now());
        pedido.setEstado("CARRITO");

        // IMPORTANTE: inicializar lista antes de agregar
        pedido.setDetalles(new ArrayList<>());

        double total = agregarDetalles(pedido, req.getDetalles());
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    // -----------------------------
    //   2) Confirmar pedido final
    // -----------------------------
    public Pedido confirmarPedido(String correo, PedidoRequest req) {

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha_pedido(LocalDate.now());
        pedido.setEstado("PENDIENTE");

        pedido.setDireccion(req.getDireccion());
        pedido.setReferencia(req.getReferencia());
        pedido.setLat(req.getLat());
        pedido.setLng(req.getLng());

        pedido.setDetalles(new ArrayList<>());

        double total = agregarDetalles(pedido, req.getDetalles());
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    // -----------------------------
    //   Método común para detalles
    // -----------------------------
    private double agregarDetalles(Pedido pedido, List<DetalleDTO> detallesDTO) {

        BigDecimal total = BigDecimal.ZERO;

        for (DetalleDTO det : detallesDTO) {

            Producto producto = productoRepository.findById(det.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + det.getProductoId()));

            DetallePedido dp = new DetallePedido();
            dp.setPedido(pedido);
            dp.setProducto(producto);
            dp.setCantidad(det.getCantidad());

            // ✔ Precio real desde la BD
            dp.setPrecio_unitario(producto.getPrecio());

            // ✔ Calcular subtotal: precio BD * cantidad
            BigDecimal subTotal = producto.getPrecio()
                    .multiply(BigDecimal.valueOf(det.getCantidad()));

            total = total.add(subTotal);

            pedido.getDetalles().add(dp);
        }

        return total.doubleValue(); // ✔ Convertir de BigDecimal a double
    }


    // -----------------------------
	//  3) Guardar dirección
	//-----------------------------
    public void guardarDireccion(String correo, DireccionDTO dto) {

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = pedidoRepository.findByUsuarioAndEstado(usuario, "CARRITO")
                .orElseThrow(() -> new RuntimeException("No hay pedido en el carrito"));

        pedido.setDireccion(dto.getDireccion());
        pedido.setReferencia(dto.getReferencia());
        pedido.setLat(dto.getLat());
        pedido.setLng(dto.getLng());

        pedidoRepository.save(pedido);
    }
    
    public Usuario obtenerUsuarioPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo).orElse(null);
    }
    
 // ✅ Nuevo: buscar usuario por ID
    public Usuario obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

	public List<Pedido> listarTodos() {
		return pedidoRepository.findAll();
	}

	public Pedido actualizarEstado(Long pedidoId, String nuevoEstado) {
        // 1. Buscar el pedido por su ID
        Optional<Pedido> pedidoOptional = pedidoRepository.findById(pedidoId);

        if (pedidoOptional.isPresent()) {
            Pedido pedido = pedidoOptional.get();
            
            // 2. Aplicar validaciones (Opcional pero muy recomendado)
            // Ejemplo: Solo puedes confirmar/rechazar si el estado actual es "PENDIENTE"
            if (!"PENDIENTE".equals(pedido.getEstado())) {
                System.out.println("No se puede actualizar el pedido " + pedidoId + 
                                   " porque su estado actual es: " + pedido.getEstado());
                return null; // O podrías lanzar una excepción
            }
            
            // 3. Actualizar el campo 'estado'
            pedido.setEstado(nuevoEstado);
            
            // 4. Guardar la entidad actualizada en la base de datos
            return pedidoRepository.save(pedido);
        }
        
        // 5. Devolver null si el pedido no fue encontrado
        return null;
    }
	
	public void confirmarPedidoPorId(Long id, String correoUsuario) {

	    Pedido pedido = pedidoRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

	    // Solo confirmar si está pendiente
	    if (!pedido.getEstado().equals("PENDIENTE")) {
	        throw new RuntimeException("El pedido ya fue procesado");
	    }

	    pedido.setEstado("CONFIRMADO");
	    pedidoRepository.save(pedido);
	}


	public void rechazarPedidoPorId(Long id, String correoUsuario) {

	    Pedido pedido = pedidoRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

	    if (!pedido.getEstado().equals("PENDIENTE")) {
	        throw new RuntimeException("El pedido ya fue procesado");
	    }

	    pedido.setEstado("RECHAZADO");
	    pedidoRepository.save(pedido);
	}

	public void eliminarPedido(Long id) {
	    if (!pedidoRepository.existsById(id)) {
	        throw new RuntimeException("Pedido no encontrado");
	    }
	    pedidoRepository.deleteById(id);
	}


}

