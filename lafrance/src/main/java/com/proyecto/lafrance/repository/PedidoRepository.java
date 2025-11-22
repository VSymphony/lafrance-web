package com.proyecto.lafrance.repository;

import com.proyecto.lafrance.model.Pedido;
import com.proyecto.lafrance.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
	Optional<Pedido> findByUsuarioAndEstado(Usuario usuario, String string);
}
