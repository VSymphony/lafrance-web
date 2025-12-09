package com.proyecto.lafrance.dto;

import lombok.Data;

@Data
public class ItemEditDTO {
    private Long id;
    private int cantidad;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public int getCantidad() {
		return cantidad;
	}
	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}
    
    
}
