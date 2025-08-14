package com.smhrd.ss.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smhrd.ss.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{
//	회원가입 - 이메일 중복 체크
	boolean existsByEmail(String email);
	
//	로그인
	UserEntity findAllByEmailAndPassword(String email, String password);
}