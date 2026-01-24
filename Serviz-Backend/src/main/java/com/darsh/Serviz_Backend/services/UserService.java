package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.configs.CustomUserDetailsService;
import com.darsh.Serviz_Backend.dto.ProviderSignUpReq;
import com.darsh.Serviz_Backend.dto.UserSignUpReq;
import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.modals.Role;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserByEmail(String email) throws Exception {
        return userRepo.findByEmail(email).orElseThrow(() -> new Exception("User Not Found"));
    }

    public User createUser(UserSignUpReq req) {
        User newUser = new User();
        newUser.setName(req.getName());
        newUser.setEmail(req.getEmail());
        newUser.setPhone(req.getPhone());
        newUser.setAddress(req.getAddress());
        newUser.setCity(req.getCity());
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));
        newUser.setRole(Role.USER);

        return userRepo.save(newUser);
    }

    public User createProvider(ProviderSignUpReq req) {
        User newUser = new User();
        newUser.setName(req.getName());
        newUser.setEmail(req.getEmail());
        newUser.setPhone(req.getPhone());
        newUser.setAddress(req.getAddress());
        newUser.setCity(req.getCity());
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));
        newUser.setRole(Role.PROVIDER);

        Provider provider = new Provider();
        provider.setServiceType(req.getServiceType());
        provider.setRating(0.0);

        provider.setUser(newUser);
        newUser.setProvider(provider);

        return userRepo.save(newUser);
    }

    public Authentication authenticateUser(String email, String password) throws BadCredentialsException {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Credentials");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
