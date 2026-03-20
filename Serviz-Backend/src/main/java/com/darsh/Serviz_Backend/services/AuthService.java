package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.configs.CustomUserDetailsService;
import com.darsh.Serviz_Backend.configs.JwtProvider;
import com.darsh.Serviz_Backend.repositories.ProviderRepo;
import com.darsh.Serviz_Backend.requests.LoginReq;
import com.darsh.Serviz_Backend.requests.ProviderSignUpReq;
import com.darsh.Serviz_Backend.requests.UserSignUpReq;
import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.modals.Role;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import com.darsh.Serviz_Backend.responses.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProviderRepo providerRepo;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    public boolean checkIfUserExistByEmail(String email) throws Exception {
        return userRepo.existsByEmail(email);
    }

    public User createUser(UserSignUpReq req) throws Exception {
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

    public boolean checkIfProviderExistByEmail(String email) throws Exception {
        return providerRepo.existsByEmail(email);
    }

    public Provider createProvider(ProviderSignUpReq req) throws Exception {
        Provider newProvider = new Provider();
        newProvider.setName(req.getName());
        newProvider.setEmail(req.getEmail());
        newProvider.setPhone(req.getPhone());
        newProvider.setAddress(req.getAddress());
        newProvider.setCity(req.getCity());
        newProvider.setPassword(passwordEncoder.encode(req.getPassword()));
        newProvider.setRole(Role.PROVIDER);
        newProvider.setServiceType(req.getServiceType());
        newProvider.setAvgRating(0.0);

        return providerRepo.save(newProvider);
    }

    public LoginResponse login(LoginReq req) {
        Authentication authentication = authenticate(req.getEmail(), req.getPassword());
        String token = jwtProvider.generateToken(authentication);
        return new LoginResponse("Login successful", token);
    }

    private Authentication authenticate(String email, String password) throws BadCredentialsException {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Credentials");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
