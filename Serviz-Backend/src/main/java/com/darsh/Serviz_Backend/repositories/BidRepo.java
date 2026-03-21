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

    boolean existsByServiceRequestIdAndProviderId(Long serviceRequestId, Long providerId);
    Optional<Bid> findByServiceRequestIdAndProviderId(Long serviceRequestId, Long providerId);

    List<Bid> findByServiceRequestId(Long serviceRequestId);
    List<Bid> findByServiceRequestIdAndStatus(Long serviceRequestId, BidStatus status);

    List<Bid> findByProvider(Provider provider);
}
