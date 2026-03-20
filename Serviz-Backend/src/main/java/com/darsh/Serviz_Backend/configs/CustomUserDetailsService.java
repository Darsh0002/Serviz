package com.darsh.Serviz_Backend.configs;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.modals.User;
import com.darsh.Serviz_Backend.repositories.ProviderRepo;
import com.darsh.Serviz_Backend.repositories.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProviderRepo providerRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Try User first
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    user.get().getEmail(),
                    user.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.get().getRole().name()))
            );
        }

        // Fall back to Provider
        Provider provider = providerRepo.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                provider.getEmail(),
                provider.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + provider.getRole().name()))
        );
    }
}
