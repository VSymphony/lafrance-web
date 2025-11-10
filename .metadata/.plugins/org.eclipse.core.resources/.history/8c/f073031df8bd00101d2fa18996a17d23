package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.UsuarioRepository;
import com.proyecto.lafrance.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        try {
            String correo = credenciales.get("correo");
            String contrasena = credenciales.get("contrasena");

            // --- Manejar ambos posibles contratos del repository ---
            // Opción A: repository devuelve Optional<Usuario>
            Optional<Usuario> optUser = usuarioRepository.findByCorreo(correo);
            Usuario usuario = optUser.orElse(null);

            // --- Si tu repo devuelve directamente Usuario uncomment y usa esto en su lugar:
            // Usuario usuario = usuarioRepository.findByCorreo(correo);

            if (usuario == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
            }

            // Validación simple (en producción usa hashing)
            if (usuario.getContrasena() != null && usuario.getContrasena().equals(contrasena)) {
                String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CLIENTE";
                String token = jwtUtil.generarToken(usuario.getCorreo(), rolNombre);

                Map<String, Object> body = Map.of(
                    "token", token,
                    "rol", rolNombre,
                    "usuarioId", usuario.getId(),
                    "nombre", usuario.getNombre()
                );

                return ResponseEntity.ok(body);
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error interno"));
        }
    }
}
