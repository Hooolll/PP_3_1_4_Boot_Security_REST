package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;


public interface UserService {
    List<User> getAllUser();
    void updateUser(User user);
    User addUser(User user);
    User findUserById(Long id);
    User loadUserByUsername(String username);
    void deleteUserById(Long id);
}