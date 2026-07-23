-- =============================================
-- Warehouse Management System (WMS)
-- Seed Data - SQL Server
-- =============================================

USE WMS_DB;
GO

-- =============================================
-- Clear Existing Data
-- =============================================

DELETE FROM InventoryTransactions;
DELETE FROM Inventory;
DELETE FROM Products;
DELETE FROM Categories;
DELETE FROM Warehouses;
GO

-- Reset Identity Values
DBCC CHECKIDENT ('InventoryTransactions', RESEED, 0);
DBCC CHECKIDENT ('Inventory', RESEED, 0);
DBCC CHECKIDENT ('Products', RESEED, 0);
DBCC CHECKIDENT ('Categories', RESEED, 0);
DBCC CHECKIDENT ('Warehouses', RESEED, 0);
GO

-- =============================================
-- Categories
-- =============================================

INSERT INTO Categories
    (Name, Description)
VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Office Supplies', 'General office materials'),
    ('Packaging', 'Boxes, Tape, and Shipping Supplies');
GO

-- =============================================
-- Warehouses
-- =============================================

INSERT INTO Warehouses
    (Name, Location, Capacity)
VALUES
    ('Main Hub - North', 'New York, NY', 5000),
    ('Fulfillment Center - West', 'Los Angeles, CA', 10000);
GO

-- =============================================
-- Products
-- =============================================

INSERT INTO Products
    (
    SKU,
    Name,
    CategoryID,
    UnitPrice
    )
VALUES
    ('ELEC-001', 'Wireless Mouse', 1, 25.50),
    ('ELEC-002', 'Mechanical Keyboard', 1, 75.00),
    ('OFFC-001', 'A4 Printer Paper (500 Sheets)', 2, 8.99),
    ('PACK-001', 'Medium Shipping Box', 3, 1.25);
GO

-- =============================================
-- Inventory
-- =============================================

INSERT INTO Inventory
    (
    WarehouseID,
    ProductID,
    Quantity
    )
VALUES
    (1, 1, 150),
    (1, 2, 50),
    (1, 3, 500),
    (2, 4, 2000);
GO

-- =============================================
-- Inventory Transactions
-- =============================================

INSERT INTO InventoryTransactions
    (
    ProductID,
    WarehouseID,
    TransactionType,
    Quantity,
    Reference
    )
VALUES
    (1, 1, 'IN', 150, 'PO-1001'),
    (2, 1, 'IN', 50, 'PO-1001'),
    (3, 1, 'IN', 500, 'PO-1002'),
    (4, 2, 'IN', 2000, 'PO-1003');
GO