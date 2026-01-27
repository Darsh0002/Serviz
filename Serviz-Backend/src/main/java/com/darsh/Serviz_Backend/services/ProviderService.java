package com.darsh.Serviz_Backend.services;

import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.repositories.ProviderRepo;
import com.darsh.Serviz_Backend.repositories.RatingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProviderService {

    @Autowired
    private ProviderRepo providerRepo;

    @Autowired
    private RatingRepo ratingRepo;

    public List<Provider> getProvidersByServiceType(String serviceType){
        return providerRepo.findByServiceType(serviceType);
    }

    public void updateProviderRating(Long providerId) {

        Double avg = ratingRepo.findAverageByProviderId(providerId);

        Provider provider = providerRepo.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        provider.setAvgRating(avg);
        providerRepo.save(provider);
    }
}
