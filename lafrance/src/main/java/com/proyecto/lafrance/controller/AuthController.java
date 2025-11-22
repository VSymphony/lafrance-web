package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.dto.LoginRequest;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.UsuarioRepository;
import com.proyecto.lafrance.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthService authService;

    AuthController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // ✅ Manejo correcto de Optional
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        String contrasenaIngresada = request.getContrasena();
        String contrasenaGuardada = usuario.getContrasena();

        boolean coincide;

        // 🧠 Verificar si la contraseña guardada parece estar cifrada
        if (contrasenaGuardada.startsWith("$2a$") || contrasenaGuardada.startsWith("$2b$")) {
            // Ya está cifrada con BCrypt
            coincide = passwordEncoder.matches(contrasenaIngresada, contrasenaGuardada);
        } else {
            // ⚠️ Contraseña antigua sin cifrar, comparación directa
            coincide = contrasenaIngresada.equals(contrasenaGuardada);

            if (coincide) {
                // 🧩 Actualizar contraseña a formato BCrypt
                usuario.setContrasena(passwordEncoder.encode(contrasenaIngresada));
                usuarioRepository.save(usuario);
                System.out.println("Contraseña actualizada a formato BCrypt para usuario: " + usuario.getCorreo());
            }
        }

        if (!coincide) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        String token = authService.generarToken(usuario);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "rol", usuario.getRol().getNombre(),
                "nombre", usuario.getNombre()
        ));
    }
}