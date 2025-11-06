package com.proyecto.lafrance.repository;

import com.proyecto.lafrance.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MesaRepository extends JpaRepository<Mesa, Long> {
    List<Mesa> findByDisponibleTrue();
}
