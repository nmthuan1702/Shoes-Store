package com.system.shoesstore.services.user;

import com.system.shoesstore.dtos.*;
import com.system.shoesstore.entities.Category;
import com.system.shoesstore.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserCategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public Response getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAll();
            List<CategoryDto> dtos = categories
                    .stream()
                    .map(this::convertCategoryToDto)
                    .collect(Collectors.toList());
            return new Response(HttpStatus.OK.value(), "Lấy danh sách danh mục thành công.", dtos);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy danh sách danh mục: " + e.getMessage(),
                    null);
        }
    }

    public Response getCategoryById(Integer categoryId) {
        try {
            Category categorie = categoryRepository.findById(categoryId).orElse(null);
            CategoryDto dto = convertCategoryToDto(categorie);
            return new Response(HttpStatus.OK.value(), "Lấy  danh mục theo id thành công.", dto);
        } catch (Exception e) {
            return new Response(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Lôĩ lấy danh mục theo id: " + e.getMessage(),
                    null);
        }
    }

    private CategoryDto convertCategoryToDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        return categoryDto;
    }
}
