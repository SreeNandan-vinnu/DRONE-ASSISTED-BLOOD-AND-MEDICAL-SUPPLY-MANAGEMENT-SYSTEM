# Medical Drone Logistics Platform

A comprehensive multi-role web application for managing medical supply deliveries using drone technology. The system supports hospitals, distribution centers, drone operators, and administrators with role-based dashboards and real-time tracking.

## Features

### Multi-Role Dashboards
- **Hospital Staff**: Place orders, track deliveries, confirm receipts
- **Distribution Center**: Manage inventory, validate orders, assign drones
- **Drone Operator**: Monitor fleet, assign missions, control operations
- **System Administrator**: User management, system logs, analytics

### Core Functionality
- Real-time order tracking and status updates
- Inventory management with automated alerts
- Drone fleet monitoring and mission control
- Secure authentication and role-based access
- RESTful API backend with MySQL database
- Responsive frontend with modern UI/UX

## Technology Stack

### Backend
- **Spring Boot 3.5.6** - Java web framework
- **MySQL** - Database
- **JPA/Hibernate** - ORM
- **Maven** - Build tool

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Client-side logic
- **Fetch API** - HTTP requests
- **Font Awesome** - Icons

## Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Modern web browser

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Dronebackend
```

### 2. Database Setup
```sql
-- Create MySQL database
CREATE DATABASE myproject;

-- Update connection details in src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/myproject
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Build and Run
```bash
# Build the application
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 4. Access the Application
- Open `http://localhost:8080` in your browser
- Select your role and login with credentials

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `POST /api/users/login` - User authentication

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `POST /api/hospitals` - Create hospital
- `PUT /api/hospitals/{id}` - Update hospital
- `DELETE /api/hospitals/{id}` - Delete hospital

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `DELETE /api/orders/{id}` - Delete order

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/{id}` - Update inventory
- `DELETE /api/inventory/{id}` - Remove inventory

### Drones
- `GET /api/drones` - Get all drones
- `POST /api/drones` - Add drone
- `PUT /api/drones/{id}` - Update drone
- `DELETE /api/drones/{id}` - Remove drone

### Missions
- `GET /api/missions` - Get all missions
- `POST /api/missions` - Create mission
- `PUT /api/missions/{id}` - Update mission
- `DELETE /api/missions/{id}` - Delete mission

### Payloads
- `GET /api/payloads` - Get all payloads
- `POST /api/payloads` - Create payload
- `PUT /api/payloads/{id}` - Update payload
- `DELETE /api/payloads/{id}` - Delete payload

### Logs
- `GET /api/logs` - Get all system logs
- `POST /api/logs` - Create log entry
- `DELETE /api/logs/{id}` - Delete log entry

## Database Schema

The application uses the following main entities:
- `users` - User accounts and roles
- `hospitals` - Medical facilities
- `orders` - Supply orders
- `inventory` - Stock management
- `drones` - Drone fleet
- `missions` - Flight missions
- `payloads` - Cargo information
- `logs` - System activity logs

## User Roles & Permissions

### Hospital Staff
- Place medical supply orders
- Track order status and ETA
- Confirm delivery receipt
- View order history

### Distribution Center
- Manage inventory levels
- Validate and approve orders
- Assign drones to missions
- Monitor supply chain

### Drone Operator
- Monitor drone fleet status
- Assign missions to drones
- Control flight operations
- Handle emergency situations

### Administrator
- Manage user accounts
- View system logs
- Generate reports
- Configure system settings

## Development

### Project Structure
```
src/
├── main/
│   ├── java/com/example/dronebackend/
│   │   ├── controller/     # REST controllers
│   │   ├── model/         # JPA entities
│   │   ├── repository/    # Data repositories
│   │   └── config/        # Configuration classes
│   └── resources/
│       ├── static/        # Frontend files
│       └── application.properties
└── test/                  # Unit tests
```

### Frontend Structure
```
src/main/resources/static/
├── index.html         # Role selection
├── login.html         # Authentication
├── hospital.html      # Hospital dashboard
├── distribution.html  # Distribution center
├── drone.html         # Drone operator
├── admin.html         # Admin panel
├── main.js           # Common utilities
├── hospital.js       # Hospital logic
├── distribution.js   # Distribution logic
├── drone.js          # Drone logic
├── admin.js          # Admin logic
└── styles.css        # Global styles
```

## Testing

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
# Test users endpoint
curl http://localhost:8080/api/users

# Create a new user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","role":"hospital"}'
```

### Frontend Testing
- Open browser developer tools
- Check Network tab for API calls
- Verify data loading and form submissions
- Test all user roles and dashboards

## Deployment

### Local Development
- Run `mvn spring-boot:run`
- Access at `http://localhost:8080`

### Production Deployment
1. Build JAR file: `mvn clean package`
2. Deploy JAR to server
3. Configure production database
4. Set up reverse proxy (nginx/apache)
5. Configure SSL certificates

### Cloud Deployment Options
- **Heroku**: Deploy JAR directly
- **AWS**: Use Elastic Beanstalk or EC2
- **Railway**: Git-based deployment
- **Render**: Docker-based deployment

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## Future Enhancements

- Real-time notifications with WebSocket
- Mobile application development
- Advanced analytics and reporting
- Integration with external APIs
- Multi-language support
- Automated testing suite
