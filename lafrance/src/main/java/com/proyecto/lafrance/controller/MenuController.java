package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.model.Producto;
import com.proyecto.lafrance.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuController {

    private final ProductoRepository productoRepository;

    public MenuController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> obtenerMenu() {
        return productoRepository.findAll()
                .stream()
                .filter(Producto::isDisponible)
                .toList();
    }
}
