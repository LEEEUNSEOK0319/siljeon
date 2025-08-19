package com.smhrd.ss.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.ss.entity.UserApiEntity;
import com.smhrd.ss.repository.UserApiRepository;

@Service
public class UserApiService {

    @Autowired
    private UserApiRepository userApiRepository;

    public UserApiEntity saveUserApi(Long userIdx, String title, String url) {
        UserApiEntity api = new UserApiEntity();
        api.setUserIdx(userIdx);
        api.setApiTitle(title);
        api.setApiURL(url);

        return userApiRepository.save(api);
    }
    
    public List<UserApiEntity> getApisByUser(Long userIdx) {
        return userApiRepository.findAllByUserIdx(userIdx);
    }
}