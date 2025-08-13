package com.smhrd.ss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.ss.entity.UserEntity;
import com.smhrd.ss.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {
	
	@Autowired
	private UserService userService;
	
	
}
