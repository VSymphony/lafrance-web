package com.proyecto.lafrance.dto;

import java.util.List;
import com.proyecto.lafrance.model.Pedido;

public class PerfilUsuarioDTO {
    private Long id;
    private String nombre;
    private String correo;
    private String telefono;
    private String direccion;
    private List<Pedido> historialPedidos;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public String getCorreo() {
		return correo;
	}
	public void setCorreo(String correo) {
		this.correo = correo;
	}
	public String getTelefono() {
		return telefono;
	}
	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
	public String getDireccion() {
		return direccion;
	}
	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}
	public List<Pedido> getHistorialPedidos() {
		return historialPedidos;
	}
	public void setHistorialPedidos(List<Pedido> historialPedidos) {
		this.historialPedidos = historialPedidos;
	}

    
}
