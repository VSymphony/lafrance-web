package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.dto.ProductoDTO;
import com.proyecto.lafrance.model.Categoria;
import com.proyecto.lafrance.model.Producto;
import com.proyecto.lafrance.repository.CategoriaRepository;
import com.proyecto.lafrance.repository.ProductoRepository;
import com.proyecto.lafrance.service.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;
    private final CategoriaRepository categoriaRepository;
    
    @Autowired
    private ProductoRepository productoRepository;

    public ProductoController(ProductoService productoService, CategoriaRepository categoriaRepository) {
        this.productoService = productoService;
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoService.listarTodos();
    }

    @PostMapping
    public Producto crear(@RequestBody ProductoDTO dto) {
        Categoria categoria = categoriaRepository.findById(dto.categoria_id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setNombre(dto.nombre);
        producto.setDescripcion(dto.descripcion);
        producto.setPrecio(dto.precio);
        producto.setImagen_url(dto.imagen_url);
        producto.setDisponible(dto.disponible != null ? dto.disponible : true);
        producto.setCategoria(categoria);

        productoService.guardar(producto);

        // Recargar para incluir la categoría en la respuesta
        return productoService.obtenerPorId(producto.getId()).orElse(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody ProductoDTO dto) {
        Producto producto = productoService.obtenerPorId(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.categoria_id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        producto.setNombre(dto.nombre);
        producto.setDescripcion(dto.descripcion);
        producto.setPrecio(dto.precio);
        producto.setImagen_url(dto.imagen_url);
        producto.setDisponible(dto.disponible != null ? dto.disponible : true);
        producto.setCategoria(categoria);

        productoService.guardar(producto);

        return producto;
    }

    
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> cambiarEstadoProducto(@PathVariable Long id) {

        return productoRepository.findById(id)
            .map(producto -> {
                producto.setActivo(!producto.isActivo());
                productoRepository.save(producto);

                return ResponseEntity.ok(Map.of(
                    "message", producto.isActivo() ? "Producto habilitado" : "Producto deshabilitado",
                    "activo", producto.isActivo(),
                    "id", producto.getId()
                ));
            })
            .orElseGet(() -> ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Producto no encontrado")));
    }

}