//
//
//package com.example.Emp_Task.Security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
//@Component
//public class JWT {
//
//    private static final String SECRET = "Akhil@2025_JWT_Secure_Key_!#8125725307Akhil@2025_JWT_Secure_Key_!#8125725307";
//    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
//    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour
//
//    // Generate JWT token with Employee details including role
//    public String generateToken(Integer id, String name, String email) {
//        Map<String, Object> claims = new HashMap<>();
//        claims.put("empId", id);
//        claims.put("name", name);
//        claims.put("email", email);
//
//        return Jwts.builder()
//                .setClaims(claims)
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public Claims validateToken(String token) {
//        try {
//            System.out.println("Validating token: " + token);
//
//            Claims c = Jwts.parserBuilder()
//                    .setSigningKey(SECRET_KEY)
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//
//            System.out.println("Token OK, EXP: " + c.getExpiration());
//            return c;
//
//        } catch (Exception e) {
//            System.out.println("JWT ERROR: " + e.getMessage());
//            return null;
//        }
//    }
//}



package com.example.Emp_Task.Security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWT {

    private static final String SECRET = "Akhil@2025_JWT_Secure_Key_!#8125725307Akhil@2025_JWT_Secure_Key_!#8125725307";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours

    public String generateToken(Integer id, String name, String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("empId", id);
        claims.put("name", name);
        claims.put("email", email);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateToken(String token) {
        try {
            System.out.println("Validating token: " + token);

            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (ExpiredJwtException e) {
            System.out.println("JWT Token expired: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT Token: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("JWT Validation error: " + e.getMessage());
        }
        return null;
    }
}