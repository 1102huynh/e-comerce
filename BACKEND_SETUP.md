# Backend Setup & Configuration

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- MySQL 5.7+ (optional, can use H2 for development)

## Building the Backend

### 1. Build with Maven
```bash
./mvnw clean install
```

### 2. Run the Application
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

## Database Configuration

### Development (H2 - In-Memory)
Default configuration uses H2 database which is great for development:
- No installation needed
- Data is stored in memory
- Data resets on application restart
- Access H2 console: http://localhost:8080/h2-console

### Production (MySQL)
To use MySQL in production:

1. Install MySQL Server
2. Create database:
```sql
CREATE DATABASE ecomerce;
```

3. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecomerce
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Product Endpoints
- `GET /products` - Get all products (paginated)
- `GET /products/{id}` - Get product details
- `GET /products/search?keyword=...` - Search products
- `GET /products/category/{categoryId}` - Get products by category
- `POST /products` - Create product (Admin)
- `PUT /products/{id}` - Update product (Admin)
- `DELETE /products/{id}` - Delete product (Admin)

### Category Endpoints
- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin)
- `PUT /categories/{id}` - Update category (Admin)
- `DELETE /categories/{id}` - Delete category (Admin)

### Order Endpoints
- `GET /orders` - Get user's orders
- `POST /orders/checkout` - Create order
- `PUT /orders/{id}` - Update order status (Admin)

### Payment Endpoints
- `POST /payments/process` - Process payment (Momo, Card, PayPal)

## Environment Variables

Create `.env` file or set environment variables:

```
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=86400000
DATABASE_URL=jdbc:h2:mem:ecomerce
DATABASE_USERNAME=sa
DATABASE_PASSWORD=
```

## Troubleshooting

### Port 8080 Already in Use
Change the port in `application.properties`:
```properties
server.port=8081
```

### Maven Build Failure
Try:
```bash
./mvnw clean install -U
```

### Database Connection Error
- Check MySQL is running
- Verify credentials in `application.properties`
- Check database exists

## Project Structure

```
src/main/
├── java/com/huynhtdt/ecomerce/
│   ├── config/          # Spring configuration
│   ├── controller/      # REST controllers
│   ├── dto/            # Data transfer objects
│   ├── entity/         # JPA entities
│   ├── repository/     # Data access layer
│   ├── security/       # JWT and security
│   └── service/        # Business logic
└── resources/
    └── application.properties  # Configuration
```

## Development Guidelines

1. **Controllers** - Handle HTTP requests
2. **Services** - Contain business logic
3. **Repositories** - Data access
4. **Entities** - Database models
5. **DTOs** - Data transfer objects for API

## Security

- JWT authentication on all protected endpoints
- Password encryption with BCrypt
- CORS configuration for frontend
- SQL injection prevention via JPA

## Testing

Run tests:
```bash
./mvnw test
```

## Deployment

The application is built as a WAR file:
```bash
./mvnw clean package
```

WAR file location: `target/e-comerce-0.0.1-SNAPSHOT.war`

Can be deployed to:
- Tomcat
- JBoss
- AWS Elastic Beanstalk
- Docker
- Any Java application server

## Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/e-comerce-0.0.1-SNAPSHOT.war app.war
ENTRYPOINT ["java", "-jar", "app.war"]
EXPOSE 8080
```

Build and run:
```bash
docker build -t ecomerce:latest .
docker run -p 8080:8080 ecomerce:latest
```

---

**Status:** ✅ Ready for development and production deployment
