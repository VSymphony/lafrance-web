package com.proyecto.lafrance.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.lafrance.dto.DireccionDTO;
import com.proyecto.lafrance.dto.PedidoRequest;
import com.proyecto.lafrance.dto.PedidoResponse;
import com.proyecto.lafrance.model.Pedido;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.PedidoRepository;
import com.proyecto.lafrance.security.JwtUtil;
import com.proyecto.lafrance.service.PedidoService;

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

        String token = auth.substring(7);

        if (!jwtUtil.validarToken(token)) {
            return ResponseEntity.status(401).body(new PedidoResponse("Token inválido", null));
        }

        String correo = jwtUtil.obtenerCorreo(token);
        pedidoService.guardarDireccion(correo, dto);

        return ResponseEntity.ok(new PedidoResponse("Dirección guardada", null));
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
}