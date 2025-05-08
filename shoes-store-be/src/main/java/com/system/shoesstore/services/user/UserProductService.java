package com.system.shoesstore.services.user;

import com.system.shoesstore.dtos.*;
import com.system.shoesstore.entities.Product;
import com.system.shoesstore.repositories.ProductRepository;
import com.system.shoesstore.utils.DTOMapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private DTOMapperUtil dtoMapper;

    public Response getListProductByCategory(int idCategory, int page, int size, String sortBy, String direction) {
        try {
            // Kiểm tra nếu sortBy là thuộc tính hợp lệ
            String validatedSortBy = validateSortBy(sortBy);

            Sort sort = direction.equalsIgnoreCase("desc") ?
                    Sort.by(Sort.Order.desc(validatedSortBy)) :
                    Sort.by(Sort.Order.asc(validatedSortBy));

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage = productRepository.findProductsByCategory_Id(idCategory, pageable);

            List<ProductDto> dtos = productPage.getContent().stream()
                    .map(product -> dtoMapper.convertToProductDto(product))
                    .collect(Collectors.toList());

            return new Response(HttpStatus.OK.value(), "Lấy sản phẩm theo danh mục thành công", dtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi lấy danh sách sản phẩm theo danh mục: " + e.getMessage(),
                    null);
        }
    }

    public Response getAllProduct(int page, int size, String sortBy, String direction) {
        try {
            String validatedSortBy = validateSortBy(sortBy);

            Sort sort = direction.equalsIgnoreCase("desc") ?
                    Sort.by(Sort.Order.desc(validatedSortBy)) :
                    Sort.by(Sort.Order.asc(validatedSortBy));

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage = productRepository.findAll(pageable);

            List<ProductDto> dtos = productPage.getContent().stream()
                    .map(product -> dtoMapper.convertToProductDto(product))
                    .collect(Collectors.toList());

            return new Response(HttpStatus.OK.value(), "Lấy sản phẩm thành công", dtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi lấy danh sách sản phẩm: " + e.getMessage(),
                    null);
        }
    }

    private String validateSortBy(String sortBy) {
        List<String> validSortFields = List.of("id", "name", "price", "createdAt", "category.name");
        return validSortFields.contains(sortBy) ? sortBy : "id";
    }

    public Response getProductById(Integer id) {
        try {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
            ProductDto dto = dtoMapper.convertToProductDto(product);
            return new Response(HttpStatus.OK.value(), "Lấy sản phẩm theo ID thành công", dto);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi lấy sản phẩm: " + e.getMessage(),
                    null);
        }
    }
}