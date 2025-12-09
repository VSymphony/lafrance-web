package com.proyecto.lafrance.dto;

import java.util.List;

public class EditarPedidoDTO {

    private String direccion;
    private String referencia;
    private List<DetalleDTO> detalles;

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }

    public List<DetalleDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleDTO> detalles) { this.detalles = detalles; }
}

