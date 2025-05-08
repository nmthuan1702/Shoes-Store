package com.system.shoesstore.services.admin;

import com.system.shoesstore.dtos.BrandDto;
import com.system.shoesstore.dtos.CategoryDto;
import com.system.shoesstore.dtos.ProductDto;
import com.system.shoesstore.dtos.Response;
import com.system.shoesstore.entities.Brand;
import com.system.shoesstore.entities.Category;
import com.system.shoesstore.entities.Product;
import com.system.shoesstore.models.manager.ProductModel;
import com.system.shoesstore.repositories.BrandRepository;
import com.system.shoesstore.repositories.CategoryRepository;
import com.system.shoesstore.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BrandRepository brandRepository;

    public Response getAllProducts() {
        try {
            List<Product> products = productRepository.findAll();
            List<ProductDto> productDtos = products.stream()
                    .map(this::convertProductDto)
                    .collect(Collectors.toList());
            return new Response(HttpStatus.OK.value(), "Lấy danh sách sản phẩm thành công", productDtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi khi lấy danh sách sản phẩm: " + e.getMessage(),
                    null);
        }
    }

    public Response createProduct(ProductModel productModel) {
        try {
            Brand brand = brandRepository.findById(productModel.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thương hiệu"));

            Category category = categoryRepository.findById(productModel.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

            Product product = new Product();
            product.setName(productModel.getName());
            product.setDescription(productModel.getDescription());
            product.setBrand(brand);
            product.setCategory(category);
            product.setCreatedAt(Instant.now());
            productRepository.save(product);
            return new Response(HttpStatus.CREATED.value(), "Sản phẩm đã được thêm thành công", product);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lỗi khi thêm sản phẩm: " + e.getMessage(), null);
        }
    }


    private ProductDto convertProductDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        if (product.getCreatedAt() != null) {
            LocalDateTime vietnamTime = LocalDateTime.ofInstant(product.getCreatedAt(), ZoneId.of("Asia/Ho_Chi_Minh"));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            productDto.setCreatedAt(vietnamTime.format(formatter));
        }
        productDto.setDescription(product.getDescription());
        if (product.getCategory() != null) {
            productDto.setCategory(new CategoryDto(product.getCategory().getId(), product.getCategory().getName()));
        }if (product.getBrand() != null) {
            productDto.setBrand(new BrandDto(product.getBrand().getId(), product.getBrand().getName()));
        }
        return productDto;
    }


}
