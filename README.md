Titen Tech Library - Library Management System (ASP.NET Core Backend)
Overview
Titen Tech Library is a comprehensive library management system with:

Frontend: React.js with Material-UI (MUI)

Backend: ASP.NET Core Web API with ADO.NET

Database: SQL Server (or other RDBMS)

Key Features
1. Book Management
Complete CRUD operations for books

Advanced search functionality

Book availability tracking

2. User Management
JWT Authentication

Role-based authorization (User, Admin)


3. Borrowing System
Checkout/return functionality

Due date tracking

Fines calculation

Installation Requirements
Development Environment
Prerequisites:

.NET Core 6.0 SDK

SQL Server 2019+

Node.js (for frontend)

Visual Studio 2022 or VS Code

Database Setup:

sql
Copy
CREATE DATABASE LibraryDB;
-- Run the provided SQL scripts to create tables
Backend Setup:

bash
Copy
cd Library.API
dotnet restore
dotnet run
Frontend Setup:

bash
Copy
cd client
npm install
npm start
Project Structure
Copy
TitenTechLibrary/
 ├── Library.API/          # ASP.NET Core Web API
 ├── Controllers/          # API endpoints
 ├── Data/                 # ADO.NET data access
 ├── Models/               # Business models  
 ├── Services/             # Business logic
 └── appsettings.json      # Configuration

Configuration
Backend (appsettings.json)
json
Copy
{
  "ConnectionStrings": {
    "LibraryConnection": "Server=.;Database=LibraryDB;Trusted_Connection=True;"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-here",
    "ExpiryInMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
Frontend (.env)
Copy
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
Data Access Layer (ADO.NET Example)
csharp
Copy
// Example Repository
public class BookRepository
{
    private readonly string _connectionString;
    
    public BookRepository(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("LibraryConnection");
    }

    public async Task<IEnumerable<Book>> GetAllBooksAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        await connection.OpenAsync();
        
        return await connection.QueryAsync<Book>(
            "SELECT * FROM Books WHERE IsActive = 1");
    }
}
API Endpoints
Endpoint	Method	Description
/api/books	GET	Get all books
/api/books/{id}	GET	Get single book
/api/books/search	GET	Search books
/api/auth/login	POST	User login
/api/users/register	POST	Register new user
/api/borrow/{bookId}	POST	Borrow a book
Deployment
Backend Deployment Options:
IIS Deployment:

Publish to folder

Configure IIS website

Set up application pool

Docker Container:

dockerfile
Copy
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "Library.API.dll"]
Azure App Service:

Publish directly from Visual Studio

Configure connection strings in Azure portal

Database Deployment:
Run SQL scripts on production server

Configure backup strategy

Set up connection string in app settings

Development Workflow
Clone repository

Restore NuGet packages

Set up database connection

Run API project

Start frontend development server

Implement features using feature branches

Create pull requests for review

Testing
Unit Tests:

bash
Copy
dotnet test
Integration Tests:

Test API endpoints with Postman

Test database operations

Support
For technical issues, contact:

Backend Team: backend@titenlib.com

Frontend Team: frontend@titenlib.com

License
Proprietary - © 2023 Titen Technologies