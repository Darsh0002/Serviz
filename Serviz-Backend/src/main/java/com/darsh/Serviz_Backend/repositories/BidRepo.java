package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Bid;
import com.darsh.Serviz_Backend.modals.BidStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepo extends JpaRepository<Bid, Long> {

    boolean existsByRequestIdAndProviderId(Long requestId, Long providerId);

    List<Bid> findByRequestId(Long requestId);

    List<Bid> findByRequestIdAndStatus(Long requestId, BidStatus status);
}

