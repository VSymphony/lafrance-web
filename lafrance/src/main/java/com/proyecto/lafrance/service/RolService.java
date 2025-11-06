package com.proyecto.lafrance.service;

import org.springframework.stereotype.Service;
import java.util.List;
import com.proyecto.lafrance.model.Rol;
import com.proyecto.lafrance.repository.RolRepository;

@Service
public class RolService {

    private final RolRepository rolRepository;

    public RolService(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    public List<Rol> listar() {
        return rolRepository.findAll();
    }

    public Rol guardar(Rol rol) {
        return rolRepository.save(rol);
    }
}
