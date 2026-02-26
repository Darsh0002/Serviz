package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Bid;
import com.darsh.Serviz_Backend.modals.BidStatus;
import com.darsh.Serviz_Backend.modals.Provider;
import com.darsh.Serviz_Backend.modals.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepo extends JpaRepository<Bid, Long> {

    boolean existsByServiceRequestAndProvider(ServiceRequest serviceReq, Provider provider);

    List<Bid> findByServiceRequest(ServiceRequest request);

    Optional<Bid> findByServiceRequestAndStatus(ServiceRequest req, BidStatus bidStatus);

    List<Bid> findByProvider(Provider provider);
}

