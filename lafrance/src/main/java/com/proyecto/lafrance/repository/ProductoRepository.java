package com.proyecto.lafrance.repository;

import com.proyecto.lafrance.model.Producto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
	List<Producto> findByActivoTrue();
}
