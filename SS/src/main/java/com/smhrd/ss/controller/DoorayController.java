package com.smhrd.ss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.ss.service.DoorayService;

import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/dooray")
public class DoorayController {

    private final DoorayService doorayService;

    @Autowired
    public DoorayController(DoorayService doorayService) {
        this.doorayService = doorayService;
    }

    /**
     * 개인 드라이브 조회
     *
     * @param apiToken 요청 바디 또는 헤더에서 전달
     * @return JSON 형태 드라이브 목록
     */
    @PostMapping("/drive")
    public Mono<ResponseEntity<String>> getDrive(@RequestParam("apiToken") String apiToken) {
        return doorayService.getPersonalDrives(apiToken)
                .map(result -> ResponseEntity.ok().body(result))
                .onErrorResume(ex -> Mono.just(ResponseEntity
                        .badRequest()
                        .body("{\"error\":\"" + ex.getMessage() + "\"}")));
    }
}
