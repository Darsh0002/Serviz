package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderRepo extends JpaRepository<Provider,Long> {
    List<Provider> findByServiceType(String serviceType);
}
