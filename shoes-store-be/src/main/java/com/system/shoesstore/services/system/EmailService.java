package com.system.shoesstore.services.system;

import com.system.shoesstore.dtos.OrderDto;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Gửi email HTML
    public void sendHtmlEmail(String toEmail, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("thuannmpc05910@fpt.edu.vn"); // Thay bằng email thật
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true để gửi HTML

        mailSender.send(message);
        System.out.println("✅ Gửi email HTML thành công đến: " + toEmail);
    }

    public String buildGiftCardEmail(OrderDto orderDto) {
        StringBuilder emailContent = new StringBuilder();

        emailContent.append("<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;'>")
                .append("<h2 style='color: #4CAF50;'>🎁 Cảm ơn bạn đã đặt hàng tại <span style='color:#2196F3;'>ShoesStore</span>!</h2>")
                .append("<p>Xin chào <strong>").append(orderDto.getUser().getUsername()).append("</strong>,</p>")
                .append("<p>Chúng tôi rất vui thông báo rằng đơn hàng của bạn với mã <strong>#")
                .append(orderDto.getId()).append("</strong> đã được <strong style='color:green;'>chấp nhận</strong> và đang được xử lý.</p>")

                .append("<h3 style='margin-top: 30px;'>📦 Thông tin đơn hàng</h3>")
                .append("<ul style='list-style:none; padding-left:0;'>")
                .append("<li><strong>Ngày đặt hàng:</strong> ").append(orderDto.getCreatedAt()).append("</li>")
                .append("<li><strong>Phương thức thanh toán:</strong> ").append(orderDto.getPaymentMethod()).append("</li>")
                .append("<li><strong>Phí vận chuyển:</strong> ").append(orderDto.getFormatShippingFee()).append("</li>")
                .append("<li><strong>Tổng tiền hàng:</strong> ").append(orderDto.getFormattedTotalPrice()).append("</li>")
                .append("<li><strong>Thành tiền:</strong> <span style='color:#d32f2f;font-weight:bold;'>")
                .append(orderDto.getTotalAmount()).append("</span></li>")
                .append("<li><strong>Thời gian giao hàng dự kiến:</strong> ").append(orderDto.getShippingTime()).append("</li>")
                .append("<li><strong>Địa chỉ giao hàng:</strong> ").append(orderDto.getShippingAddress()).append("</li>")
                .append("</ul>")

                .append("<div style='margin-top: 30px; padding: 15px; border: 2px dashed #4CAF50; background-color: #ffffff;'>")
                .append("<h3 style='margin: 0; color: #FF5722;'>🎉 Quà tặng dành riêng cho bạn!</h3>")
                .append("<p style='font-size: 18px; margin: 10px 0;'><strong>Mã Giảm Giá: <span style='color:#d32f2f;'>SHOES10</span></strong></p>")
                .append("<p>Giảm ngay 10% cho đơn hàng tiếp theo. Hãy sử dụng mã này khi thanh toán.</p>")
                .append("</div>")

                .append("<p style='margin-top: 30px;'>Cảm ơn bạn đã tin tưởng và mua sắm cùng chúng tôi.</p>")
                .append("<p>Trân trọng,<br><strong>Đội ngũ ShoesStore 👟</strong></p>")
                .append("</div>");

        return emailContent.toString();
    }
    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("thuannmpc05910@fpt.edu.vn");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
        System.out.println("Gửi email thành công đến: " + toEmail);
    }

}
