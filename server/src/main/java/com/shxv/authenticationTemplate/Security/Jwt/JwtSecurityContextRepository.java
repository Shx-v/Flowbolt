package com.shxv.authenticationTemplate.Security.Jwt;

import com.shxv.authenticationTemplate.Auth.Repository.SessionRepository;
import com.shxv.authenticationTemplate.Auth.Repository.UserRepository;
import com.shxv.authenticationTemplate.Role.Model.Permission;
import com.shxv.authenticationTemplate.Role.Service.PermissionService;
import com.shxv.authenticationTemplate.Security.CustomAuthenticationManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.ReactiveUserDetailsService;
import org.springframework.security.web.server.context.ServerSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class JwtSecurityContextRepository implements ServerSecurityContextRepository {

    @Autowired
    CustomAuthenticationManager authenticationManager;

    @Autowired
    SessionRepository sessionRepository;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    ReactiveUserDetailsService userDetailsService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PermissionService permissionService;


    @Override
    public Mono<Void> save(ServerWebExchange exchange, SecurityContext context) {
        // Stateless, nothing to save
        return Mono.empty();
    }

    @Override
    public Mono<SecurityContext> load(ServerWebExchange exchange) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Mono.empty();
        }

        String token = authHeader.substring(7);

        // Invalid token → no context
        if (!jwtUtils.isTokenValid(token)) {
            return Mono.empty();
        }

        String username = jwtUtils.extractUsername(token);

        return sessionRepository.findByAccessTokenAndActiveIsTrue(token)
                .switchIfEmpty(Mono.empty())
                .flatMap(session ->
                        userRepository.findByUsername(username)
                                .switchIfEmpty(Mono.empty())
                )
                .flatMap(user ->
                        permissionService.getAllPermissions(user.getRole())
                                .map(perms -> perms.stream().map(Permission::getName).toList())
                                .map(permissionNames -> new UserPrincipal(
                                        user.getId(),
                                        user.getUsername(),
                                        user.getRole(),
                                        permissionNames
                                ))
                )
                .flatMap(userPrincipal ->
                        userDetailsService.findByUsername(username)
                                .map(userDetails -> new UsernamePasswordAuthenticationToken(
                                        userPrincipal,
                                        null,
                                        userDetails.getAuthorities()
                                ))
                )
                .map(SecurityContextImpl::new);
    }

}
