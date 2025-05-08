package com.system.shoesstore.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "shipping_address_id")
    private Shippingaddress shippingAddress;

    @Column(name = "shipping_fee")
    private Double shippingFee;

    @Size(max = 255)
    @Column(name = "shipping_time")
    private String shippingTime;

    @NotNull
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @ColumnDefault("'Chờ xử lý'")
    @Lob
    @Column(name = "statuss")
    private String status;

    @NotNull
    @ColumnDefault("'Thanh toán khi nhận hàng'")
    @Lob
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @ColumnDefault("'Chờ thanh toán'")
    @Lob
    @Column(name = "payment_status")
    private String paymentStatus;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @OneToMany(mappedBy = "order")
    private Set<Orderdetail> orderdetails = new LinkedHashSet<>();

    @OneToMany(mappedBy = "order")
    private Set<Ordertracking> ordertrackings = new LinkedHashSet<>();

}