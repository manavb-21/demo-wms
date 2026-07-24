SELECT * FROM Categories;
SELECT * FROM Warehouses;
SELECT * FROM Products;

DBCC CHECKIDENT ('Categories', NORESEED);

SELECT
    name,
    seed_value,
    increment_value,
    last_value
FROM sys.identity_columns
WHERE OBJECT_NAME(object_id) = 'Categories';

USE master;
GO
DROP DATABASE WMS_DB;
GO

USE master;
GO

ALTER DATABASE WMS_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE WMS_DB;
GO