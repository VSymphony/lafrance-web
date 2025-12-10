package com.proyecto.lafrance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.lafrance.dto.DireccionDTO;
import com.proyecto.lafrance.dto.EditarPedidoDTO;
import com.proyecto.lafrance.dto.PedidoRequest;
import com.proyecto.lafrance.dto.PedidoResponse;
import com.proyecto.lafrance.model.Pedido;
import com.proyecto.lafrance.model.Producto;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.PedidoRepository;
import com.proyecto.lafrance.repository.ProductoRepository;
import com.proyecto.lafrance.security.JwtUtil;
import com.proyecto.lafrance.service.PedidoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    private final PedidoService pedidoService;
    private final JwtUtil jwtUtil;

    @Autowired
    private PedidoRepository pedidoRepository;

    public PedidoController(PedidoService pedidoService, JwtUtil jwtUtil) {
        this.pedidoService = pedidoService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Crear pedido en carrito
    @PostMapping
    public ResponseEntity<PedidoResponse> crearPedido(
            @RequestBody PedidoRequest request,
            @RequestHeader(value = "Authorization", required = false) String auth) {

        Usuario usuario = null;

        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            if (jwtUtil.validarToken(token)) {
                String correo = jwtUtil.obtenerCorreo(token);
                usuario = pedidoService.obtenerUsuarioPorCorreo(correo);
            }
        }

        Pedido pedido = pedidoService.crearPedidoDesdeRequest(usuario, request);

        return ResponseEntity.ok(new PedidoResponse("Pedido creado en carrito", pedido.getId()));
    }

    // ✅ Guardar dirección
    @PostMapping("/guardarDireccion")
    public ResponseEntity<PedidoResponse> guardarDireccion(
            @RequestBody DireccionDTO dto,
            @RequestHeader("Authorization") String auth) {

        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(new PedidoResponse("Token no proporcionado", null));
        }

        String rawToken = auth.substring(7);
        String token = rawToken.replaceAll("\\s+", "").trim();
        
        if (!jwtUtil.validarToken(token)) {
            return ResponseEntity.status(401).body(new PedidoResponse("Token inválido", null));
        }

        String correo = jwtUtil.obtenerCorreo(token);
        pedidoService.guardarDireccion(correo, dto);

        return ResponseEntity.ok(new PedidoResponse("Dirección guardada", null));
    }
    
    @GetMapping()
    public List<Pedido> listar() {
        return pedidoService.listarTodos();
    }
    

    // ✅ Confirmar pedido
    @PostMapping("/confirmar")
    public ResponseEntity<PedidoResponse> confirmarPedido(
            @RequestBody PedidoRequest request,
            @RequestHeader(value = "Authorization", required = false) String auth) {

        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(new PedidoResponse("Token no proporcionado", null));
        }

        String token = auth.substring(7);

        if (!jwtUtil.validarToken(token)) {
            return ResponseEntity.status(401)
                    .body(new PedidoResponse("Token inválido", null));
        }

        // ✅ Ahora puedes obtener más datos del usuario directamente del token
        Long usuarioId = jwtUtil.obtenerId(token);
        String nombre = jwtUtil.obtenerNombre(token);
        String correo = jwtUtil.obtenerCorreo(token);
        String rol = jwtUtil.obtenerRol(token);

        Usuario usuario = pedidoService.obtenerUsuarioPorId(usuarioId);

        if (usuario == null) {
            return ResponseEntity.status(401)
                    .body(new PedidoResponse("Usuario no encontrado", null));
        }

        Pedido pedido = pedidoService.confirmarPedido(correo, request);

        return ResponseEntity.ok(
                new PedidoResponse("Pedido confirmado para " + nombre, pedido.getId())
        );
    }
    
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "Authorization", required = false) String auth) {

        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Token no proporcionado"));
        }

        String token = auth.substring(7);
        if (!jwtUtil.validarToken(token)) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Token inválido"));
        }

        String nuevoEstado = body.get("estado");
        if (nuevoEstado == null || nuevoEstado.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Se debe proporcionar un estado válido"));
        }

        try {
            Pedido pedido = pedidoService.obtenerPorId(id);
            if (pedido == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Pedido no encontrado"));
            }

            // Validar transición de estados
            String estadoActual = pedido.getEstado();
            boolean valido = switch (estadoActual) {
                case "PENDIENTE" -> nuevoEstado.equals("CONFIRMADO") || nuevoEstado.equals("CANCELADO");
                case "CONFIRMADO" -> nuevoEstado.equals("EN_CAMINO") || nuevoEstado.equals("CANCELADO");
                case "EN_CAMINO" -> nuevoEstado.equals("ENTREGADO");
                default -> false;
            };

            if (!valido) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Transición de estado inválida"));
            }

            pedido.setEstado(nuevoEstado);
            pedidoService.guardarPedido(pedido);

            return ResponseEntity.ok(Map.of("message", "Estado actualizado a " + nuevoEstado));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error al actualizar el estado: " + e.getMessage()));
        }
    }


	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminarPedido(
	        @PathVariable Long id,
	        @RequestHeader(value = "Authorization", required = false) String auth) {

	    if (auth == null || !auth.startsWith("Bearer ")) {
	        return ResponseEntity.status(401)
	                .body(Map.of("message", "Token no proporcionado"));
	    }

	    String token = auth.substring(7);

	    if (!jwtUtil.validarToken(token)) {
	        return ResponseEntity.status(401)
	                .body(Map.of("message", "Token inválido"));
	    }

	    try {
	        pedidoService.eliminarPedido(id);
	        return ResponseEntity.ok(Map.of("message", "Pedido eliminado correctamente"));
	    } catch (Exception e) {
	        return ResponseEntity.status(400)
	                .body(Map.of("message", e.getMessage()));
	    }
	}
	
	
	@PutMapping("/actualizar/{id}")
	public ResponseEntity<?> actualizarPedido(
	        @PathVariable Long id,
	        @RequestBody EditarPedidoDTO dto) {

	    Pedido actualizado = pedidoService.editarPedido(
	            id,
	            dto.getDetalles(),    
	            dto.getDireccion(),   
	            dto.getReferencia()   
	    );
	    
	    return ResponseEntity.ok(actualizado);
	}
	
	
}