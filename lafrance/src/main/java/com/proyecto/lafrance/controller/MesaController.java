package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.model.Mesa;
import com.proyecto.lafrance.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "http://localhost:5173")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;

    @GetMapping
    public List<Mesa> obtenerMesas() {
        return mesaRepository.findAll();
    }

    @GetMapping("/disponibles")
    public List<Mesa> obtenerMesasDisponibles() {
        return mesaRepository.findByDisponibleTrue();
    }

    @PostMapping
    public Mesa crearMesa(@RequestBody Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mesa> actualizarMesa(@PathVariable Long id, @RequestBody Mesa mesaActualizada) {
        Mesa mesa = mesaRepository.findById(id).orElse(null);
        if (mesa == null) return ResponseEntity.notFound().build();

        mesa.setNumero(mesaActualizada.getNumero());
        mesa.setCapacidad(mesaActualizada.getCapacidad());
        mesa.setDisponible(mesaActualizada.isDisponible());
        mesaRepository.save(mesa);
        return ResponseEntity.ok(mesa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMesa(@PathVariable Long id) {
        mesaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
