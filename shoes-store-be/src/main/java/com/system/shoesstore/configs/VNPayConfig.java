package com.system.shoesstore.configs;

import java.util.ResourceBundle;
public class VNPayConfig {
    public static String vnp_Version = "2.1.0";
    public static String vnp_Command = "pay";
    public static String vnp_TmnCode = "D89JELJB"; // mã của bạn
    public static String vnp_HashSecret = "TJMKLVPQHH0X1JJLQX21GJ1OSO0QI1Y0"; // mã bí mật của bạn
    public static String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static String vnp_ReturnUrl = "http://localhost:8080/api/payment/return";
    public static String vnp_CurrCode = "VND";
}