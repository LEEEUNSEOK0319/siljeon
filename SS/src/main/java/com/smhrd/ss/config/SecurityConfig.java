package com.smhrd.ss.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

import com.smhrd.ss.entity.UserEntity;
import com.smhrd.ss.service.UserService;

@Configuration
public class SecurityConfig {

    private final UserService userService;

    public SecurityConfig(UserService userService) {
        this.userService = userService; // 생성자 주입
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .redirectionEndpoint(redirection -> redirection
                    .baseUri("/api/auth/google")
                )
                .successHandler((request, response, authentication) -> {
                    OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
                    String email = (String) oauthUser.getAttributes().get("email");
                    String name = (String) oauthUser.getAttributes().get("name");

                    // DB에 저장 & 세션 저장
                    UserEntity user = new UserEntity();
                    user.setEmail(email);
                    user.setName(name);
                    user.setOAuth(1);

                    Boolean exists = userService.check(user); // 이메일 중복 체크
                    if (!exists) {
                        userService.register(user); // DB 저장
                    }

                    request.getSession().setAttribute("user", user); // 세션에 저장
                    response.sendRedirect("http://localhost:5173/"); // React 홈으로
                })
            );

        return http.build();
    }
}