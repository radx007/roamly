package com.roamly.model.dto.movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActorDTO {
    private Integer id;
    private String name;
    private String character;
    private String profilePath;
    private Integer order;
}
