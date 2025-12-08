package com.proyecto.lafrance.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.lafrance.dto.PerfilUsuarioDTO;
import com.proyecto.lafrance.model.Pedido;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.security.JwtUtil;
import com.proyecto.lafrance.service.PedidoService;
import com.proyecto.lafrance.service.UsuarioService;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "http://localhost:5173")
public class PerfilController {

    private final PedidoService pedidoService;
    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public PerfilController(PedidoService pedidoService, UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.pedidoService = pedidoService;
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<?> obtenerPerfil(@RequestHeader("Authorization") String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Token no proporcionado"));
        }

        String token = auth.substring(7);
        if (!jwtUtil.validarToken(token)) {
            return ResponseEntity.status(401).body(Map.of("message", "Token inválido"));
        }

        Long usuarioId = jwtUtil.obtenerId(token);
        Optional<Usuario> usuarioOpt = usuarioService.obtenerPorId(usuarioId);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOpt.get();

        PerfilUsuarioDTO perfil = new PerfilUsuarioDTO();
        perfil.setId(usuario.getId());
        perfil.setNombre(usuario.getNombre());
        perfil.setCorreo(usuario.getCorreo());
        perfil.setTelefono(usuario.getTelefono());

        // Traer historial de pedidos
        List<Pedido> pedidos = pedidoService.listarPorUsuario(usuarioId);
        perfil.setHistorialPedidos(pedidos);

        // Obtener la dirección del último pedido si existe
        if (!pedidos.isEmpty()) {
            Pedido ultimoPedido = pedidos.get(pedidos.size() - 1);
            perfil.setDireccion(ultimoPedido.getDireccion() + 
                               (ultimoPedido.getReferencia() != null ? " (" + ultimoPedido.getReferencia() + ")" : ""));
        } else {
            perfil.setDireccion("—");
        }

        return ResponseEntity.ok(perfil);
    }
}
