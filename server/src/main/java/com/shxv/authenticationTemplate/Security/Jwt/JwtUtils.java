package com.shxv.authenticationTemplate.Security.Jwt;

import com.shxv.authenticationTemplate.Auth.Model.User;
import com.shxv.authenticationTemplate.Role.Model.Permission;
import com.shxv.authenticationTemplate.Role.Service.PermissionService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.security.Key;
import java.util.*;

@Component
public class JwtUtils {

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.expirationMs}")
    private long expirationMs;

    private Key key;

    @Autowired
    PermissionService permissionService;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);
        Map<String, Object> userJwtDTO = convertUserToMap(user);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("user", userJwtDTO)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (30L * 24 * 60 * 60 * 1000));
        Map<String, Object> userJwtDTO = convertUserToMap(user);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("user", userJwtDTO)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public UUID extractUser(String token) {
        return UUID.fromString(
                (String) extractAllClaims(token)
                        .get("user", Map.class)
                        .get("id")
        );
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(this.key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Map<String, Object> convertUserToMap(User user) {
        Map<String, Object> map = new HashMap<>();

        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("roleId", user.getRole());
        return map;
    }

}
