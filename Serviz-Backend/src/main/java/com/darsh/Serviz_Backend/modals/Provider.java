package com.darsh.Serviz_Backend.modals;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Provider {

    @Id
    @GeneratedValue
    private Long id;

    private String serviceType;
    private double rating;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
//    @JsonIgnore
    private User user;
}

