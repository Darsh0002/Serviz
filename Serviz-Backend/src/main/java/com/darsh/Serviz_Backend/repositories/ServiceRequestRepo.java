package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.ServiceReqStatus;
import com.darsh.Serviz_Backend.modals.ServiceRequest;
import com.darsh.Serviz_Backend.modals.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepo extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByCityAndServiceTypeAndStatus(
            String city,
            String serviceType,
            ServiceReqStatus status
    );

    List<ServiceRequest> findByUserAndStatus(User user, ServiceReqStatus serviceReqStatus);
}
