package com.proyecto.lafrance.model;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class PedidoItem {
	
	@ManyToOne
	@JoinColumn(name = "pedido_id")
	private Pedido pedido;

}
