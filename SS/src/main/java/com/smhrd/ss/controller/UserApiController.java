package com.smhrd.ss.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.ss.entity.UserApiEntity;
import com.smhrd.ss.entity.UserEntity;
import com.smhrd.ss.service.UserApiService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class UserApiController {

	@Autowired
    private UserApiService userApiService;

    @PostMapping("/addApi")
    public ResponseEntity<Map<String, String>> addApi(
            @RequestBody Map<String, String> request, HttpSession session) {

        UserEntity sessionUser = (UserEntity) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "로그인이 필요합니다."));
        }

        String title = request.get("apiTitle");
        String url = request.get("apiURL");

        if (title == null || title.isEmpty() || url == null || url.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("message", "API 이름과 URL을 모두 입력해주세요."));
        }

        userApiService.saveUserApi(sessionUser.getUserIdx(), title, url);

        return ResponseEntity.ok(Collections.singletonMap("message", "API가 성공적으로 저장되었습니다."));
    }
    
    @GetMapping("/myApis")
    public ResponseEntity<?> getUserApis(HttpSession session) {
        UserEntity sessionUser = (UserEntity) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "로그인이 필요합니다."));
        }
        System.out.println(sessionUser.getUserIdx());
        List<UserApiEntity> apis = userApiService.getApisByUser(sessionUser.getUserIdx());
        System.out.println(apis);
        return ResponseEntity.ok(apis);
    }
}