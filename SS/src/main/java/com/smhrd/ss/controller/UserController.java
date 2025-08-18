package com.smhrd.ss.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.ss.entity.UserEntity;
import com.smhrd.ss.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class UserController {
	@Autowired
	private UserService userService;
	
	@PostMapping("/login")
	public ResponseEntity<List<Object>> login(@RequestBody Map<String, Object> request, HttpSession session) {
		String email = (String) request.get("email");
		String password = (String) request.get("password");
		Boolean rememberMe = request.get("rememberMe") != null && (Boolean) request.get("rememberMe");
		
		UserEntity entity = new UserEntity();
		entity.setEmail(email);
		entity.setPassword(password);
		
		UserEntity user = userService.login(entity);
		if (user != null) {
			session.setAttribute("user", user);
			
			if (rememberMe) {
				session.setMaxInactiveInterval(60 * 60 * 24);
			}
			
			return ResponseEntity.ok(Collections.singletonList(user));
		} else {
			return ResponseEntity.status(
					HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
		}
	}
	
	@PostMapping("register")
	public ResponseEntity<Map<String, String>> register(@RequestBody UserEntity request) {
		Boolean check = userService.check(request);
		if (check) {
			return ResponseEntity
					.status(HttpStatus.CONFLICT)
					.body(Collections.singletonMap("message", "이메일이 중복되었습니다."));
		}
		
		UserEntity entity = new UserEntity();
		entity.setName(request.getName());
		entity.setEmail(request.getEmail());
		entity.setPassword(request.getPassword());
		entity.setOAuth(0);
		
		String result = userService.register(entity);
		
		if(result.equals("success")) {
			return ResponseEntity.ok(Collections.singletonMap("message", "success"));
		}else {
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(Collections.singletonMap("message", "이메일 또는 비밀번호를 확인하세요."));
		}
	}
	
//	로그인 유지
	@GetMapping("/me")
	public ResponseEntity<List<UserEntity>> getCurrentUser(HttpSession session) {
		UserEntity user = (UserEntity) session.getAttribute("user");
		if (user != null) {
			return ResponseEntity.ok(Collections.singletonList(user));
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Collections.emptyList());
		}
	}
	
	// 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Collections.singletonMap("message", "로그아웃 성공"));
    }
	
}
