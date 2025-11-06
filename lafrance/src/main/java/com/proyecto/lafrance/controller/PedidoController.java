package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.model.Pedido;
import com.proyecto.lafrance.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoRepository pedidoRepository;

    // 🔹 Obtener todos los pedidos (solo ADMIN)
    @GetMapping
    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    // 🔹 Obtener pedidos por usuario (CLIENTE)
    @GetMapping("/usuario/{id}")
    public List<Pedido> listarPorUsuario(@PathVariable Long id) {
        return pedidoRepository.findByUsuarioId(id);
    }

    // 🔹 Crear un nuevo pedido (CLIENTE)
    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        pedido.setFecha_pedido(LocalDate.now());
        pedido.setEstado("Pendiente");
        double total = pedido.getDetalles().stream()
                .mapToDouble(d -> d.getCantidad() * d.getPrecio_unitario())
                .sum();
        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }

    // 🔹 Actualizar el estado del pedido (ADMIN)
    @PutMapping("/{id}/estado")
    public Pedido actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    // 🔹 Eliminar un pedido (ADMIN)
    @DeleteMapping("/{id}")
    public void eliminarPedido(@PathVariable Long id) {
        pedidoRepository.deleteById(id);
    }
}
