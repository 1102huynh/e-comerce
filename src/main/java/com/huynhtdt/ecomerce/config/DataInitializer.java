package com.huynhtdt.ecomerce.config;

import com.huynhtdt.ecomerce.entity.Category;
import com.huynhtdt.ecomerce.entity.Product;
import com.huynhtdt.ecomerce.entity.User;
import com.huynhtdt.ecomerce.repository.CategoryRepository;
import com.huynhtdt.ecomerce.repository.ProductRepository;
import com.huynhtdt.ecomerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Admin User");
            admin.setPhone("1234567890");
            admin.setAddress("Admin Address");
            Set<String> adminRoles = new HashSet<>();
            adminRoles.add("ADMIN");
            adminRoles.add("USER");
            admin.setRoles(adminRoles);
            userRepository.save(admin);
        }

        // Create regular user
        if (!userRepository.existsByEmail("user@example.com")) {
            User user = new User();
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFullName("Regular User");
            user.setPhone("0987654321");
            user.setAddress("User Address");
            Set<String> userRoles = new HashSet<>();
            userRoles.add("USER");
            user.setRoles(userRoles);
            userRepository.save(user);
        }

        // Create hat/cap categories
        if (categoryRepository.count() == 0) {
            Category baseball = new Category();
            baseball.setName("Baseball Caps");
            baseball.setDescription("Classic baseball caps for everyday wear");
            categoryRepository.save(baseball);

            Category snapback = new Category();
            snapback.setName("Snapback Caps");
            snapback.setDescription("Trendy snapback caps with adjustable closure");
            categoryRepository.save(snapback);

            Category trucker = new Category();
            trucker.setName("Trucker Hats");
            trucker.setDescription("Mesh back trucker hats for casual style");
            categoryRepository.save(trucker);

            Category beanie = new Category();
            beanie.setName("Beanies");
            beanie.setDescription("Warm and stylish beanies for cold weather");
            categoryRepository.save(beanie);

            Category bucket = new Category();
            bucket.setName("Bucket Hats");
            bucket.setDescription("Trendy bucket hats for sun protection");
            categoryRepository.save(bucket);

            Category fedora = new Category();
            fedora.setName("Fedoras & Dress Hats");
            fedora.setDescription("Elegant fedoras and formal dress hats");
            categoryRepository.save(fedora);

            // Create hat/cap products
            Product product1 = new Product();
            product1.setName("Classic Black Baseball Cap");
            product1.setDescription("Premium cotton baseball cap with adjustable strap. Perfect for everyday wear with timeless black design.");
            product1.setPrice(new BigDecimal("24.99"));
            product1.setStock(150);
            product1.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product1.setCategory(baseball);
            productRepository.save(product1);

            Product product2 = new Product();
            product2.setName("Urban Streetwear Snapback");
            product2.setDescription("Bold snapback cap with embroidered logo. Features flat brim and snap closure for perfect fit.");
            product2.setPrice(new BigDecimal("32.99"));
            product2.setStock(120);
            product2.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product2.setCategory(snapback);
            productRepository.save(product2);

            Product product3 = new Product();
            product3.setName("Vintage Trucker Hat");
            product3.setDescription("Retro-style trucker hat with mesh back for breathability. Curved brim and foam front panel.");
            product3.setPrice(new BigDecimal("27.99"));
            product3.setStock(100);
            product3.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product3.setCategory(trucker);
            productRepository.save(product3);

            Product product4 = new Product();
            product4.setName("Cozy Knit Beanie");
            product4.setDescription("Soft knit beanie with fold-up cuff. Made from warm acrylic blend, perfect for winter.");
            product4.setPrice(new BigDecimal("19.99"));
            product4.setStock(200);
            product4.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product4.setCategory(beanie);
            productRepository.save(product4);

            Product product5 = new Product();
            product5.setName("Summer Bucket Hat");
            product5.setDescription("Lightweight cotton bucket hat with wide brim. Perfect for beach days and outdoor festivals.");
            product5.setPrice(new BigDecimal("29.99"));
            product5.setStock(85);
            product5.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product5.setCategory(bucket);
            productRepository.save(product5);

            Product product6 = new Product();
            product6.setName("Classic Wool Fedora");
            product6.setDescription("Elegant wool fedora with grosgrain ribbon band. Sophisticated style for formal occasions.");
            product6.setPrice(new BigDecimal("49.99"));
            product6.setStock(60);
            product6.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product6.setCategory(fedora);
            productRepository.save(product6);

            Product product7 = new Product();
            product7.setName("Sports Performance Cap");
            product7.setDescription("Moisture-wicking athletic cap with UV protection. Lightweight and breathable for active lifestyle.");
            product7.setPrice(new BigDecimal("34.99"));
            product7.setStock(110);
            product7.setImageUrl("https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product7.setCategory(baseball);
            productRepository.save(product7);

            Product product8 = new Product();
            product8.setName("Vintage Denim Snapback");
            product8.setDescription("Distressed denim snapback with leather patch. Unique vintage look with modern comfort.");
            product8.setPrice(new BigDecimal("36.99"));
            product8.setStock(75);
            product8.setImageUrl("https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product8.setCategory(snapback);
            productRepository.save(product8);

            Product product9 = new Product();
            product9.setName("Chunky Cable Knit Beanie");
            product9.setDescription("Thick cable knit beanie with pom-pom. Extra warm and stylish for cold winter days.");
            product9.setPrice(new BigDecimal("24.99"));
            product9.setStock(130);
            product9.setImageUrl("https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600");
            product9.setCategory(beanie);
            productRepository.save(product9);

            Product product10 = new Product();
            product10.setName("Reversible Bucket Hat");
            product10.setDescription("Two-in-one reversible bucket hat. Solid color on one side, pattern on the other.");
            product10.setPrice(new BigDecimal("32.99"));
            product10.setStock(95);
            product10.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product10.setCategory(bucket);
            productRepository.save(product10);

            Product product11 = new Product();
            product11.setName("Wide Brim Panama Hat");
            product11.setDescription("Handwoven straw panama hat with leather band. Classic summer elegance with excellent sun protection.");
            product11.setPrice(new BigDecimal("54.99"));
            product11.setStock(45);
            product11.setImageUrl("https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product11.setCategory(fedora);
            productRepository.save(product11);

            Product product12 = new Product();
            product12.setName("Camo Trucker Cap");
            product12.setDescription("Camouflage pattern trucker hat with mesh back. Perfect for outdoor adventures and hunting.");
            product12.setPrice(new BigDecimal("26.99"));
            product12.setStock(105);
            product12.setImageUrl("https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600");
            product12.setCategory(trucker);
            productRepository.save(product12);
        }

        System.out.println("Sample data initialized successfully!");
        System.out.println("Admin user: admin@example.com / admin123");
        System.out.println("Regular user: user@example.com / user123");
    }
}

