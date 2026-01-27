package com.darsh.Serviz_Backend.modals;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceType;
    private Double avgRating;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
//    @JsonIgnore
    private User user;
}

