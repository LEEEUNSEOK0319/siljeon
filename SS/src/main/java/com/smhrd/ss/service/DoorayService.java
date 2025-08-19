package com.smhrd.ss.service;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import reactor.core.publisher.Mono;

@Service
public class DoorayService {

	private final WebClient webClient;

	public DoorayService(@org.springframework.beans.factory.annotation.Value("${dooray.api.base-url:https://api.dooray.com/drive/v1}") String baseUrl) {
		this.webClient = WebClient.builder().baseUrl(baseUrl).build();
	}

	/**
	 * 개인 드라이브 조회
	 *
	 * @param apiToken 개인 API 토큰
	 * @return 드라이브 JSON 문자열
	 */
	public Mono<String> getPersonalDrives(String apiToken) {
		return webClient.get().uri(uriBuilder -> uriBuilder.path("/drives").queryParam("type", "private").build())
				.header(HttpHeaders.AUTHORIZATION, "dooray-api " + apiToken).retrieve().bodyToMono(String.class)
				.onErrorResume(WebClientResponseException.class, ex -> {
					// 예외 로깅
					System.err
							.println("Dooray API 호출 실패: " + ex.getStatusCode() + " / " + ex.getResponseBodyAsString());
					return Mono.error(new RuntimeException("Dooray API 연결 실패"));
				});
	}
}
