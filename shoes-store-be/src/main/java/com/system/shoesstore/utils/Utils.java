package com.system.shoesstore.utils;

import java.text.NumberFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class Utils {

    // Format thời gian theo múi giờ Việt Nam (Asia/Ho_Chi_Minh)
//    public static String formatDateToVietnameseDay(Instant instant) {
//        return instant.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
//    }

    public static String formatDateToVietnameseTime(Instant instant) {
        return instant.atZone(ZoneId.of("Asia/Ho_Chi_Minh")).format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy "));
    }


    public static String formatCurrency(Double amount) {
        Locale vietnameseLocale = new Locale("vi", "VN");
        NumberFormat numberFormat = NumberFormat.getNumberInstance(vietnameseLocale);
        String formattedAmount = numberFormat.format(amount);
        return formattedAmount + " VND";
    }
}
