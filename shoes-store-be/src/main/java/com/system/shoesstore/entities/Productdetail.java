package com.system.shoesstore.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "productdetails")
public class Productdetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id", nullable = false)
    private com.system.shoesstore.entities.Product product;

    @Column(name = "size", nullable = false)
    private Integer size;

    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @ColumnDefault("0")
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @Column(name = "image_url")
    private String imageUrl;

    @ColumnDefault("b'1'")
    @Column(name = "status")
    private Boolean status;

    @OneToMany(mappedBy = "productDetail")
    private Set<Cartdetail> cartdetails = new LinkedHashSet<>();

    @OneToMany(mappedBy = "productDetail")
    private Set<Orderdetail> orderdetails = new LinkedHashSet<>();

}