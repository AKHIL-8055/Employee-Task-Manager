//
//package com.example.Emp_Task.Security;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.Collections;
//import java.util.List;
//
//@Component
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//    @Autowired
//    private JWT jwtUtil;
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        String path = request.getRequestURI();
//
//        // Public endpoints
//        if (path.contains("/auth/signup") || path.contains("/auth/signin") || path.contains("/add")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        String authHeader = request.getHeader("Authorization");
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Missing or invalid Authorization header");
//            return;
//        }
//
//        String token = authHeader.substring(7);
//        token = token.replace("Bearer ", "").trim();
//
//        try {
//            var claims = jwtUtil.validateToken(token);
//
//            if (claims == null) {
//                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                response.getWriter().write("Invalid or expired token");
//                return;
//            }
//
//            String empId = claims.get("empId").toString();
//            String email = claims.getSubject();
//
//
//            UsernamePasswordAuthenticationToken authentication =
//                    new UsernamePasswordAuthenticationToken(email, null);
//
//            authentication.setDetails(empId);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            filterChain.doFilter(request, response);
//
//        } catch (Exception e) {
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.getWriter().write("Token validation failed: " + e.getMessage());
//        }
//    }
//}


package com.example.Emp_Task.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWT jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("Incoming request: " + path);

        // Public endpoints - no token required
        if (path.startsWith("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Handle preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        System.out.println("Auth Header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            sendError(response, "Missing or invalid Authorization header");
            return;
        }

        // FIX: Better token extraction to handle "Bearer Bearer token" case
        String token = extractToken(authHeader);

        if (token == null || token.isEmpty()) {
            sendError(response, "Token is empty");
            return;
        }

        System.out.println("Extracted token: " + token);

        try {
            var claims = jwtUtil.validateToken(token);

            if (claims == null) {
                sendError(response, "Invalid or expired token");
                return;
            }

            // Extract claims
            Integer empId = claims.get("empId", Integer.class);
            String email = claims.getSubject();
            String name = claims.get("name", String.class);

            System.out.println("Authenticated user - ID: " + empId + ", Email: " + email);

            // Create authentication token
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))
                    );

            // Store employee ID in details for easy access in controllers
            authentication.setDetails(empId);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("Authentication set in SecurityContext");

        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            sendError(response, "Authentication failed: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(String authHeader) {
        if (authHeader == null) return null;

        // Split by space and take the last part (the actual token)
        String[] parts = authHeader.split(" ");
        if (parts.length == 0) return null;

        // Return the last part which should be the token
        return parts[parts.length - 1];
    }

    private void sendError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}