package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.dto.ReservaDTO;
import com.proyecto.lafrance.model.Rol;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.ReservaRepository;
import com.proyecto.lafrance.repository.RolRepository;
import com.proyecto.lafrance.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    private final ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    UsuarioController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario loginData) {
        Optional<Usuario> usuario = usuarioRepository.findByCorreoAndContrasena(
                loginData.getCorreo(),
                loginData.getContrasena()
        );
        return usuario.orElse(null);
    }

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        try {
            // Verificar si el correo ya existe
            if (usuarioRepository.findByCorreo(nuevoUsuario.getCorreo()).isPresent()) {
                return ResponseEntity.badRequest().build();
            }

            Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                    .orElseThrow(() -> new RuntimeException("Rol CLIENTE no encontrado"));

            nuevoUsuario.setRol(rolCliente);

            Usuario guardado = usuarioRepository.save(nuevoUsuario);
            return ResponseEntity.ok(guardado);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}
