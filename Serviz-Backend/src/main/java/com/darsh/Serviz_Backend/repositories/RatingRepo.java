package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {

    boolean existsByUserIdAndRequestId(Long userId, Long requestId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.providerId = :providerId")
    Double findAverageByProviderId(Long providerId);
}

