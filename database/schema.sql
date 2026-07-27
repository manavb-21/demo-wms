-- =============================================
-- Warehouse Management System (WMS)
-- Database Schema - Azure SQL
-- =============================================

-- =============================================
-- Drop Existing Tables (Safe Re-run)
-- =============================================

IF OBJECT_ID('InventoryTransactions', 'U') IS NOT NULL
    DROP TABLE InventoryTransactions;

IF OBJECT_ID('Inventory', 'U') IS NOT NULL
    DROP TABLE Inventory;

IF OBJECT_ID('Products', 'U') IS NOT NULL
    DROP TABLE Products;

IF OBJECT_ID('Categories', 'U') IS NOT NULL
    DROP TABLE Categories;

IF OBJECT_ID('Warehouses', 'U') IS NOT NULL
    DROP TABLE Warehouses;

IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;
GO
-- =============================================
-- Warehouses
-- =============================================

CREATE TABLE Warehouses
(
    WarehouseID INT IDENTITY(1,1) PRIMARY KEY,

    Name NVARCHAR(100) NOT NULL,

    Location NVARCHAR(255) NOT NULL,

    Capacity INT NOT NULL
        CHECK (Capacity >= 0),

    IsActive BIT NOT NULL
        DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE()
);
GO

-- =============================================
-- Categories
-- =============================================

CREATE TABLE Categories
(
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,

    Name NVARCHAR(50) NOT NULL
        UNIQUE,

    Description NVARCHAR(255),

    IsActive BIT NOT NULL
        DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE()
);
GO

-- =============================================
-- Products
-- =============================================

CREATE TABLE Products
(
    ProductID INT IDENTITY(1,1) PRIMARY KEY,

    SKU NVARCHAR(50) NOT NULL
        UNIQUE,

    Name NVARCHAR(150) NOT NULL,

    CategoryID INT NOT NULL,

    UnitPrice DECIMAL(18,2) NOT NULL
        DEFAULT 0.00
        CHECK (UnitPrice >= 0),

    IsActive BIT NOT NULL
        DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE(),

    CONSTRAINT FK_Products_Categories
        FOREIGN KEY (CategoryID)
        REFERENCES Categories(CategoryID)
);
GO

-- =============================================
-- Inventory
-- =============================================

CREATE TABLE Inventory
(
    InventoryID INT IDENTITY(1,1) PRIMARY KEY,

    WarehouseID INT NOT NULL,

    ProductID INT NOT NULL,

    Quantity INT NOT NULL
        DEFAULT 0
        CHECK (Quantity >= 0),

    UpdatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE(),

    CONSTRAINT FK_Inventory_Warehouses
        FOREIGN KEY (WarehouseID)
        REFERENCES Warehouses(WarehouseID),

    CONSTRAINT FK_Inventory_Products
        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID),

    CONSTRAINT UQ_Inventory_Warehouse_Product
        UNIQUE (WarehouseID, ProductID)
);
GO

-- =============================================
-- Inventory Transactions
-- =============================================

CREATE TABLE InventoryTransactions
(
    TransactionID INT IDENTITY(1,1) PRIMARY KEY,

    ProductID INT NOT NULL,

    WarehouseID INT NOT NULL,

    TransactionType NVARCHAR(20) NOT NULL
        CHECK (TransactionType IN ('IN', 'OUT', 'ADJUSTMENT')),

    Quantity INT NOT NULL
        CHECK (Quantity > 0),

    Reference NVARCHAR(100),

    TransactionDate DATETIME2 NOT NULL
        DEFAULT GETDATE(),

    CONSTRAINT FK_InventoryTransactions_Products
        FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID),

    CONSTRAINT FK_InventoryTransactions_Warehouses
        FOREIGN KEY (WarehouseID)
        REFERENCES Warehouses(WarehouseID)
);
GO

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX IX_Products_SKU
ON Products (SKU);

CREATE INDEX IX_Products_Category
ON Products (CategoryID);

CREATE INDEX IX_Inventory_Warehouse
ON Inventory (WarehouseID);

CREATE INDEX IX_Inventory_Product
ON Inventory (ProductID);

CREATE INDEX IX_InventoryTransactions_Date
ON InventoryTransactions (TransactionDate);

CREATE INDEX IX_InventoryTransactions_Product
ON InventoryTransactions (ProductID);
GO


IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) UNIQUE NOT NULL,
        Password NVARCHAR(255) NOT NULL, 
        Role NVARCHAR(20) NOT NULL DEFAULT 'ADMIN',
        DisplayName NVARCHAR(100) NOT NULL,
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETUTCDATE()
    );
END
GO