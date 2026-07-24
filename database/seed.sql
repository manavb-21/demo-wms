USE WMS_DB;
GO

DELETE FROM InventoryTransactions;
DELETE FROM Inventory;
DELETE FROM Products;
DELETE FROM Categories;
DELETE FROM Warehouses;
GO

INSERT INTO Categories
    (Name, Description)
VALUES
    ('Electronics', 'Consumer electronics and accessories'),
    ('Office Supplies', 'Office stationery and supplies'),
    ('Packaging', 'Packaging materials and shipping supplies');
GO

INSERT INTO Warehouses
    (Name, Location, Capacity)
VALUES
    ('North India Distribution Hub', 'Delhi', 12000),
    ('West India Fulfillment Center', 'Mumbai', 18000),
    ('South India Distribution Center', 'Bengaluru', 15000),
    ('East India Regional Warehouse', 'Kolkata', 10000);
GO

INSERT INTO Products
(
    SKU,
    Name,
    CategoryID,
    UnitPrice
)
VALUES
    ('ELEC-001', 'Logitech Wireless Mouse', 1, 899.00),
    ('ELEC-002', 'Mechanical Gaming Keyboard', 1, 3499.00),
    ('ELEC-003', 'USB-C Charger 65W', 1, 1499.00),

    ('OFFC-001', 'A4 Copier Paper (500 Sheets)', 2, 325.00),
    ('OFFC-002', 'Stapler Machine', 2, 180.00),
    ('OFFC-003', 'Permanent Marker Set', 2, 120.00),

    ('PACK-001', 'Medium Corrugated Box', 3, 35.00),
    ('PACK-002', 'Brown Packing Tape', 3, 65.00),
    ('PACK-003', 'Bubble Wrap Roll', 3, 220.00);
GO

INSERT INTO Inventory
(
    WarehouseID,
    ProductID,
    Quantity
)
VALUES
    (1,1,250),
    (1,2,120),
    (1,4,800),

    (2,3,400),
    (2,7,1500),
    (2,8,900),

    (3,5,600),
    (3,6,450),
    (3,9,350),

    (4,1,180),
    (4,4,700),
    (4,7,1000);
GO

INSERT INTO InventoryTransactions
(
    ProductID,
    WarehouseID,
    TransactionType,
    Quantity,
    Reference
)
VALUES
    (1,1,'IN',250,'PO-DEL-1001'),
    (2,1,'IN',120,'PO-DEL-1002'),
    (4,1,'IN',800,'PO-DEL-1003'),

    (3,2,'IN',400,'PO-MUM-1001'),
    (7,2,'IN',1500,'PO-MUM-1002'),
    (8,2,'IN',900,'PO-MUM-1003'),

    (5,3,'IN',600,'PO-BLR-1001'),
    (6,3,'IN',450,'PO-BLR-1002'),
    (9,3,'IN',350,'PO-BLR-1003'),

    (1,4,'IN',180,'PO-KOL-1001'),
    (4,4,'IN',700,'PO-KOL-1002'),
    (7,4,'IN',1000,'PO-KOL-1003');
GO