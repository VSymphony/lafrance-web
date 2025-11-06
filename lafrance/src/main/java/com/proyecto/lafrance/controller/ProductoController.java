package com.proyecto.lafrance.controller;

import com.proyecto.lafrance.dto.ProductoDTO;
import com.proyecto.lafrance.model.Categoria;
import com.proyecto.lafrance.model.Producto;
import com.proyecto.lafrance.repository.CategoriaRepository;
import com.proyecto.lafrance.service.ProductoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;
    private final CategoriaRepository categoriaRepository;

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
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        producto.setId(id);
        return productoService.guardar(producto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
    }
}