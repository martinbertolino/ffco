-- *** WARNING: be careful when running this script ***
-- connect using the commend:
-- "c:\Program Files\PostgreSQL\9.6\bin\psql.exe" -U postgres

-- *** WARNING: need to switch to the right database now! ***
-- in psql switch to the new database using the command \connect ffco

DROP TABLE public."SalesTransactionDetail";
DROP TABLE public."SalesTransaction";
DROP TABLE public."SalesTransactionStatus";
DROP TABLE public."Product";
DROP TABLE public."ProductUnit";
DROP TABLE public."ProductGrouping";
DROP TABLE public."User";

DROP SEQUENCE public."SalesTransaction_SalesTransactionId_seq"; 
DROP SEQUENCE public."SalesTransactionStatus_SalesTransactionStatusId_seq"; 
DROP SEQUENCE public."Product_ProductId_seq"; 
DROP SEQUENCE public."ProductUnit_UnitId_seq"; 
DROP SEQUENCE public."ProductGrouping_ProductGroupingId_seq"; 
DROP SEQUENCE public."User_UserId_seq"; 

-- *** WARNING: need to switch OUT of the database now! ***
-- in psql switch to the new database using the command \connect postgres

-- this may fail if some process is still connected
DROP DATABASE ffco;
DROP TABLESPACE ffco;

-- end

