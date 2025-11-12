package com.proyecto.lafrance.repository;

import com.proyecto.lafrance.model.Usuario;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	Usuario findByCorreo(String correo);
	Optional<Usuario> findByCorreoAndContrasena(String correo, String contrasena);
}
