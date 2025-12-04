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
            admin.setFullName("Huynh Nguyen");
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
            user.setFullName("User 1");
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
            product1.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product1.setCategory(baseball);
            productRepository.save(product1);

            Product product2 = new Product();
            product2.setName("Urban Streetwear Snapback");
            product2.setDescription("Bold snapback cap with embroidered logo. Features flat brim and snap closure for perfect fit.");
            product2.setPrice(new BigDecimal("32.99"));
            product2.setStock(120);
            product2.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product2.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product2.setCategory(snapback);
            productRepository.save(product2);

            Product product3 = new Product();
            product3.setName("Vintage Trucker Hat");
            product3.setDescription("Retro-style trucker hat with mesh back for breathability. Curved brim and foam front panel.");
            product3.setPrice(new BigDecimal("27.99"));
            product3.setStock(100);
            product3.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product3.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product3.setCategory(trucker);
            productRepository.save(product3);

            Product product4 = new Product();
            product4.setName("Cozy Knit Beanie");
            product4.setDescription("Soft knit beanie with fold-up cuff. Made from warm acrylic blend, perfect for winter.");
            product4.setPrice(new BigDecimal("19.99"));
            product4.setStock(200);
            product4.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product4.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product4.setCategory(beanie);
            productRepository.save(product4);

            Product product5 = new Product();
            product5.setName("Summer Bucket Hat");
            product5.setDescription("Lightweight cotton bucket hat with wide brim. Perfect for beach days and outdoor festivals.");
            product5.setPrice(new BigDecimal("29.99"));
            product5.setStock(85);
            product5.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product5.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product5.setCategory(bucket);
            productRepository.save(product5);

            Product product6 = new Product();
            product6.setName("Classic Wool Fedora");
            product6.setDescription("Elegant wool fedora with grosgrain ribbon band. Sophisticated style for formal occasions.");
            product6.setPrice(new BigDecimal("49.99"));
            product6.setStock(60);
            product6.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product6.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product6.setCategory(fedora);
            productRepository.save(product6);

            Product product7 = new Product();
            product7.setName("Sports Performance Cap");
            product7.setDescription("Moisture-wicking athletic cap with UV protection. Lightweight and breathable for active lifestyle.");
            product7.setPrice(new BigDecimal("34.99"));
            product7.setStock(110);
            product7.setImageUrl("https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product7.setImages("https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product7.setCategory(baseball);
            productRepository.save(product7);

            Product product8 = new Product();
            product8.setName("Vintage Denim Snapback");
            product8.setDescription("Distressed denim snapback with leather patch. Unique vintage look with modern comfort.");
            product8.setPrice(new BigDecimal("36.99"));
            product8.setStock(75);
            product8.setImageUrl("https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product8.setImages("https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product8.setCategory(snapback);
            productRepository.save(product8);

            Product product9 = new Product();
            product9.setName("Chunky Cable Knit Beanie");
            product9.setDescription("Thick cable knit beanie with pom-pom. Extra warm and stylish for cold winter days.");
            product9.setPrice(new BigDecimal("24.99"));
            product9.setStock(130);
            product9.setImageUrl("https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600");
            product9.setImages("https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product9.setCategory(beanie);
            productRepository.save(product9);

            Product product10 = new Product();
            product10.setName("Reversible Bucket Hat");
            product10.setDescription("Two-in-one reversible bucket hat. Solid color on one side, pattern on the other.");
            product10.setPrice(new BigDecimal("32.99"));
            product10.setStock(95);
            product10.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product10.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product10.setCategory(bucket);
            productRepository.save(product10);

            Product product11 = new Product();
            product11.setName("Wide Brim Panama Hat");
            product11.setDescription("Handwoven straw panama hat with leather band. Classic summer elegance with excellent sun protection.");
            product11.setPrice(new BigDecimal("54.99"));
            product11.setStock(45);
            product11.setImageUrl("https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product11.setImages("https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product11.setCategory(fedora);
            productRepository.save(product11);

            Product product12 = new Product();
            product12.setName("Camo Trucker Cap");
            product12.setDescription("Camouflage pattern trucker hat with mesh back. Perfect for outdoor adventures and hunting.");
            product12.setPrice(new BigDecimal("26.99"));
            product12.setStock(105);
            product12.setImageUrl("https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600");
            product12.setImages("https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product12.setCategory(trucker);
            productRepository.save(product12);

            Product product13 = new Product();
            product13.setName("Navy Blue Baseball Cap");
            product13.setDescription("Classic navy blue baseball cap with white stitching. Versatile and comfortable for all occasions.");
            product13.setPrice(new BigDecimal("22.99"));
            product13.setStock(140);
            product13.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product13.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product13.setCategory(baseball);
            productRepository.save(product13);

            Product product14 = new Product();
            product14.setName("Red Snapback Cap");
            product14.setDescription("Bold red snapback with adjustable fit. Perfect for sports fans and casual style.");
            product14.setPrice(new BigDecimal("28.99"));
            product14.setStock(95);
            product14.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product14.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product14.setCategory(snapback);
            productRepository.save(product14);

            Product product15 = new Product();
            product15.setName("White Mesh Trucker");
            product15.setDescription("Cool white mesh trucker hat with solid front panel. Great for summer and breathability.");
            product15.setPrice(new BigDecimal("25.99"));
            product15.setStock(110);
            product15.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product15.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product15.setCategory(trucker);
            productRepository.save(product15);

            Product product16 = new Product();
            product16.setName("Gray Ribbed Beanie");
            product16.setDescription("Soft gray ribbed beanie with folded cuff. Perfect winter essential.");
            product16.setPrice(new BigDecimal("21.99"));
            product16.setStock(160);
            product16.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product16.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product16.setCategory(beanie);
            productRepository.save(product16);

            Product product17 = new Product();
            product17.setName("Black Bucket Hat");
            product17.setDescription("Classic black bucket hat with wide brim. Timeless style for any season.");
            product17.setPrice(new BigDecimal("30.99"));
            product17.setStock(85);
            product17.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product17.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product17.setCategory(bucket);
            productRepository.save(product17);

            Product product18 = new Product();
            product18.setName("Brown Leather Fedora");
            product18.setDescription("Rich brown fedora with leather band. Sophisticated and timeless elegance.");
            product18.setPrice(new BigDecimal("55.99"));
            product18.setStock(50);
            product18.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product18.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product18.setCategory(fedora);
            productRepository.save(product18);

            Product product19 = new Product();
            product19.setName("Olive Green Baseball Cap");
            product19.setDescription("Military-style olive green baseball cap. Perfect for outdoor enthusiasts.");
            product19.setPrice(new BigDecimal("23.99"));
            product19.setStock(130);
            product19.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product19.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product19.setCategory(baseball);
            productRepository.save(product19);

            Product product20 = new Product();
            product20.setName("Black Snapback with Logo");
            product20.setDescription("Sleek black snapback with embroidered logo. Modern urban style.");
            product20.setPrice(new BigDecimal("31.99"));
            product20.setStock(105);
            product20.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product20.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product20.setCategory(snapback);
            productRepository.save(product20);

            Product product21 = new Product();
            product21.setName("Tan Trucker Hat");
            product21.setDescription("Neutral tan trucker hat with breathable mesh. Versatile for any outfit.");
            product21.setPrice(new BigDecimal("27.99"));
            product21.setStock(100);
            product21.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product21.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product21.setCategory(trucker);
            productRepository.save(product21);

            Product product22 = new Product();
            product22.setName("Burgundy Knit Beanie");
            product22.setDescription("Rich burgundy knit beanie perfect for fall and winter fashion.");
            product22.setPrice(new BigDecimal("23.99"));
            product22.setStock(125);
            product22.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product22.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product22.setCategory(beanie);
            productRepository.save(product22);

            Product product23 = new Product();
            product23.setName("Khaki Bucket Hat");
            product23.setDescription("Comfortable khaki bucket hat with adjustable chin strap. Perfect for outdoor adventures.");
            product23.setPrice(new BigDecimal("31.99"));
            product23.setStock(90);
            product23.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product23.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product23.setCategory(bucket);
            productRepository.save(product23);

            Product product24 = new Product();
            product24.setName("Black Wool Fedora");
            product24.setDescription("Premium black wool fedora with grosgrain ribbon. Timeless formal style.");
            product24.setPrice(new BigDecimal("58.99"));
            product24.setStock(40);
            product24.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product24.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product24.setCategory(fedora);
            productRepository.save(product24);

            Product product25 = new Product();
            product25.setName("White Sports Cap");
            product25.setDescription("Clean white athletic cap with moisture-wicking technology. Perfect for active wear.");
            product25.setPrice(new BigDecimal("26.99"));
            product25.setStock(150);
            product25.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product25.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product25.setCategory(baseball);
            productRepository.save(product25);

            Product product26 = new Product();
            product26.setName("Purple Snapback");
            product26.setDescription("Vibrant purple snapback with bold design. Stand out from the crowd.");
            product26.setPrice(new BigDecimal("29.99"));
            product26.setStock(80);
            product26.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product26.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product26.setCategory(snapback);
            productRepository.save(product26);

            Product product27 = new Product();
            product27.setName("Gray Mesh Trucker");
            product27.setDescription("Light gray trucker hat with ventilated mesh back. Cool and comfortable.");
            product27.setPrice(new BigDecimal("26.99"));
            product27.setStock(115);
            product27.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product27.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product27.setCategory(trucker);
            productRepository.save(product27);

            Product product28 = new Product();
            product28.setName("Black Pom Pom Beanie");
            product28.setDescription("Cute black beanie with fluffy pom-pom. Cozy winter accessory.");
            product28.setPrice(new BigDecimal("24.99"));
            product28.setStock(140);
            product28.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product28.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product28.setCategory(beanie);
            productRepository.save(product28);

            Product product29 = new Product();
            product29.setName("Navy Bucket Hat");
            product29.setDescription("Deep navy bucket hat with washed finish. Classic and comfortable.");
            product29.setPrice(new BigDecimal("29.99"));
            product29.setStock(95);
            product29.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product29.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product29.setCategory(bucket);
            productRepository.save(product29);

            Product product30 = new Product();
            product30.setName("Charcoal Fedora");
            product30.setDescription("Sophisticated charcoal fedora with leather trim. Elegant for special occasions.");
            product30.setPrice(new BigDecimal("52.99"));
            product30.setStock(55);
            product30.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product30.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product30.setCategory(fedora);
            productRepository.save(product30);

            Product product31 = new Product();
            product31.setName("Maroon Baseball Cap");
            product31.setDescription("Deep maroon baseball cap with curved bill. Perfect for casual style.");
            product31.setPrice(new BigDecimal("24.99"));
            product31.setStock(135);
            product31.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product31.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product31.setCategory(baseball);
            productRepository.save(product31);

            Product product32 = new Product();
            product32.setName("Teal Snapback");
            product32.setDescription("Fresh teal snapback cap. Modern color for fashion-forward style.");
            product32.setPrice(new BigDecimal("30.99"));
            product32.setStock(85);
            product32.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product32.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product32.setCategory(snapback);
            productRepository.save(product32);

            Product product33 = new Product();
            product33.setName("Vintage Black Trucker");
            product33.setDescription("Vintage-style black trucker hat with classic mesh back. Retro cool.");
            product33.setPrice(new BigDecimal("28.99"));
            product33.setStock(100);
            product33.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product33.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product33.setCategory(trucker);
            productRepository.save(product33);

            Product product34 = new Product();
            product34.setName("Cream Wool Beanie");
            product34.setDescription("Soft cream wool beanie for ultimate warmth. Premium winter wear.");
            product34.setPrice(new BigDecimal("29.99"));
            product34.setStock(110);
            product34.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product34.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product34.setCategory(beanie);
            productRepository.save(product34);

            Product product35 = new Product();
            product35.setName("Green Canvas Bucket");
            product35.setDescription("Durable green canvas bucket hat. Perfect for outdoor activities.");
            product35.setPrice(new BigDecimal("32.99"));
            product35.setStock(80);
            product35.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product35.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product35.setCategory(bucket);
            productRepository.save(product35);

            Product product36 = new Product();
            product36.setName("Gray Wool Fedora");
            product36.setDescription("Classic gray wool fedora. Sophisticated and timeless elegance.");
            product36.setPrice(new BigDecimal("56.99"));
            product36.setStock(45);
            product36.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product36.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product36.setCategory(fedora);
            productRepository.save(product36);

            Product product37 = new Product();
            product37.setName("Black Dad Hat");
            product37.setDescription("Casual black dad hat with curved visor. Perfect for everyday wear.");
            product37.setPrice(new BigDecimal("25.99"));
            product37.setStock(145);
            product37.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product37.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product37.setCategory(baseball);
            productRepository.save(product37);

            Product product38 = new Product();
            product38.setName("Forest Green Snapback");
            product38.setDescription("Deep forest green snapback. Perfect for nature lovers.");
            product38.setPrice(new BigDecimal("29.99"));
            product38.setStock(90);
            product38.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product38.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product38.setCategory(snapback);
            productRepository.save(product38);

            Product product39 = new Product();
            product39.setName("Rust Trucker Hat");
            product39.setDescription("Warm rust color trucker hat with breathable mesh. Stylish and practical.");
            product39.setPrice(new BigDecimal("27.99"));
            product39.setStock(105);
            product39.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product39.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product39.setCategory(trucker);
            productRepository.save(product39);

            Product product40 = new Product();
            product40.setName("Navy Pom Pom Beanie");
            product40.setDescription("Navy beanie with white pom-pom. Cute and warm winter accessory.");
            product40.setPrice(new BigDecimal("24.99"));
            product40.setStock(135);
            product40.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product40.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product40.setCategory(beanie);
            productRepository.save(product40);

            Product product41 = new Product();
            product41.setName("Black Wide Brim Bucket");
            product41.setDescription("Black bucket hat with extra wide brim for sun protection. Outdoor essential.");
            product41.setPrice(new BigDecimal("33.99"));
            product41.setStock(75);
            product41.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product41.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product41.setCategory(bucket);
            productRepository.save(product41);

            Product product42 = new Product();
            product42.setName("Camel Fedora");
            product42.setDescription("Elegant camel-colored fedora. Sophisticated and versatile.");
            product42.setPrice(new BigDecimal("54.99"));
            product42.setStock(50);
            product42.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product42.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product42.setCategory(fedora);
            productRepository.save(product42);

            Product product43 = new Product();
            product43.setName("Tan Baseball Cap");
            product43.setDescription("Neutral tan baseball cap. Versatile for any outfit combination.");
            product43.setPrice(new BigDecimal("23.99"));
            product43.setStock(140);
            product43.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product43.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product43.setCategory(baseball);
            productRepository.save(product43);

            Product product44 = new Product();
            product44.setName("Coral Snapback");
            product44.setDescription("Vibrant coral snapback. Perfect for spring and summer style.");
            product44.setPrice(new BigDecimal("28.99"));
            product44.setStock(85);
            product44.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product44.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product44.setCategory(snapback);
            productRepository.save(product44);

            Product product45 = new Product();
            product45.setName("Stone Mesh Trucker");
            product45.setDescription("Stone color trucker hat with ventilated mesh. Cool and neutral.");
            product45.setPrice(new BigDecimal("26.99"));
            product45.setStock(120);
            product45.setImageUrl("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600");
            product45.setImages("https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?w=600,https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product45.setCategory(trucker);
            productRepository.save(product45);

            Product product46 = new Product();
            product46.setName("Heather Gray Beanie");
            product46.setDescription("Comfortable heather gray beanie. Perfect for everyday winter wear.");
            product46.setPrice(new BigDecimal("22.99"));
            product46.setStock(150);
            product46.setImageUrl("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600");
            product46.setImages("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600,https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product46.setCategory(beanie);
            productRepository.save(product46);

            Product product47 = new Product();
            product47.setName("White Cotton Bucket");
            product47.setDescription("Clean white cotton bucket hat. Perfect for beach days.");
            product47.setPrice(new BigDecimal("28.99"));
            product47.setStock(100);
            product47.setImageUrl("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600");
            product47.setImages("https://images.unsplash.com/photo-1576662712957-9c79ae1280f8?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600");
            product47.setCategory(bucket);
            productRepository.save(product47);

            Product product48 = new Product();
            product48.setName("Navy Dress Fedora");
            product48.setDescription("Navy dress fedora with silk band. Elegant for formal occasions.");
            product48.setPrice(new BigDecimal("59.99"));
            product48.setStock(40);
            product48.setImageUrl("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600");
            product48.setImages("https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600,https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product48.setCategory(fedora);
            productRepository.save(product48);

            Product product49 = new Product();
            product49.setName("Khaki Dad Hat");
            product49.setDescription("Casual khaki dad hat. Perfect for relaxed everyday style.");
            product49.setPrice(new BigDecimal("24.99"));
            product49.setStock(130);
            product49.setImageUrl("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600");
            product49.setImages("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600,https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600");
            product49.setCategory(baseball);
            productRepository.save(product49);

            Product product50 = new Product();
            product50.setName("Gold Metallic Snapback");
            product50.setDescription("Trendy gold metallic snapback. Statement piece for fashion enthusiasts.");
            product50.setPrice(new BigDecimal("32.99"));
            product50.setStock(70);
            product50.setImageUrl("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600");
            product50.setImages("https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600,https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=600,https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600,https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600");
            product50.setCategory(snapback);
            productRepository.save(product50);
        }

        System.out.println("Sample data initialized successfully!");
        System.out.println("Admin user: admin@example.com / admin123");
        System.out.println("Regular user: user@example.com / user123");
        System.out.println("Total products loaded: 50 samples");
    }
}

