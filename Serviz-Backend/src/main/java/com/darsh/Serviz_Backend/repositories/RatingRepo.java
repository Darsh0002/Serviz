package com.darsh.Serviz_Backend.repositories;

import com.darsh.Serviz_Backend.modals.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {

    List<Rating> findByProviderId(Long providerId);
    boolean existsByUserIdAndBookingId(Long userId, Long bookingId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.provider.id = :providerId")
    Double findAvgScoreByProviderId(@Param("providerId") Long providerId);
}

