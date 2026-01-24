package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.repositories.ProviderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepo providerRepo;

    public List<Provider> getProvidersByServiceType(String serviceType){
        return providerRepo.findByServiceType(serviceType);
    }
}
