package com.proyecto.lafrance.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.proyecto.lafrance.model.Rol;
import com.proyecto.lafrance.service.RolService;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    public List<Rol> listar() {
        return rolService.listar();
    }

    @PostMapping
    public Rol crear(@RequestBody Rol rol) {
        return rolService.guardar(rol);
    }
}
