package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.model.Reserva;
import com.proyecto.lafrance.model.Usuario;
import com.proyecto.lafrance.repository.ReservaRepository;
import com.proyecto.lafrance.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 🟢 Obtener todas las reservas
    @GetMapping
    public List<Reserva> obtenerReservas() {
        return reservaRepository.findAll();
    }

    // 🟢 Crear nueva reserva vinculada a usuario
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@RequestBody Map<String, String> datos) {
        try {
            System.out.println("📩 Datos recibidos: " + datos); // 👈 para depurar

            Long usuarioId = Long.parseLong(datos.get("usuarioId"));
            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            Reserva reserva = new Reserva();
            reserva.setUsuario(usuario);
            reserva.setNumeroPersonas(Integer.parseInt(datos.get("numeroPersonas")));
            reserva.setFechaHora(LocalDateTime.parse(datos.get("fechaHora")));

            Reserva guardada = reservaRepository.save(reserva);
            return ResponseEntity.ok(guardada);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }


    // 🟡 Cambiar estado (Confirmar / Rechazar)
    @PutMapping("/{id}/estado")
    public ResponseEntity<Reserva> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reserva.setEstado(Reserva.EstadoReserva.valueOf(body.get("estado")));
        reservaRepository.save(reserva);

        return ResponseEntity.ok(reserva);
    }
}
