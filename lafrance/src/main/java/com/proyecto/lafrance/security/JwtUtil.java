package com.proyecto.lafrance.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.security.Key;

import com.proyecto.lafrance.model.Usuario;

@Component
public class JwtUtil {

	private static final String SECRET_KEY_STRING = "claveSeguraParaJWT12345678901234567890";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes(StandardCharsets.UTF_8));
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 horas


    // ✅ Generar token con más claims
    public String generarToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getCorreo()) // correo como subject
                .claim("id", usuario.getId())
                .claim("nombre", usuario.getNombre())
                .claim("rol", usuario.getRol().getNombre())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Validar token
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("Token expirado");
            return false;
        } catch (JwtException e) {
            System.out.println("Token inválido: " + e.getMessage());
            return false;
        }
    }

    // ✅ Obtener correo
    public String obtenerCorreo(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // ✅ Obtener rol
    public String obtenerRol(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("rol");
    }

    // ✅ Obtener id
    public Long obtenerId(String token) {
        return ((Number) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("id")).longValue();
    }

    // ✅ Obtener nombre
    public String obtenerNombre(String token) {
        return (String) Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("nombre");
    }
}