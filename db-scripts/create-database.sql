-- connect using the command:
-- "c:\Program Files\PostgreSQL\9.6\bin\psql.exe" --username=postgres --dbname=postgres
-- "c:\Program Files\PostgreSQL\9.6\bin\psql.exe" --username=postgres --dbname=ffco

-- Tablespace: ffco

-- DROP TABLESPACE ffco;

CREATE TABLESPACE ffco
  OWNER postgres
  LOCATION 'C:\Program Files\PostgreSQL\9.6\data\pg_tblspc';

ALTER TABLESPACE ffco
  OWNER TO postgres;

-- Database: ffco

-- DROP DATABASE ffco;

CREATE DATABASE ffco
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = ffco
    CONNECTION LIMIT = -1;

-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- ********************************************************************************
-- *** WARNING: need to switch to the new database now! ***
-- in psql switch to the new database using the command \connect ffco
-- !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
-- ********************************************************************************

-- ********************************************************************************
-- DROP SEQUENCE public."User_UserId_seq"; 

CREATE SEQUENCE public."User_UserId_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."User_UserId_seq"
    OWNER TO postgres;

-- Table: public."User"

-- DROP TABLE public."User";

CREATE TABLE public."User"
(
    "UserId" integer NOT NULL DEFAULT nextval('"User_UserId_seq"'::regclass),
    "UserName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "UserFirstName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "UserLastName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("UserId") USING INDEX TABLESPACE ffco,
    CONSTRAINT "UserName" UNIQUE ("UserName") USING INDEX TABLESPACE ffco
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."User"
    OWNER to postgres;

-- ********************************************************************************
-- DROP SEQUENCE public."ProductGrouping_ProductGroupingId_seq"; 

CREATE SEQUENCE public."ProductGrouping_ProductGroupingId_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."ProductGrouping_ProductGroupingId_seq"
    OWNER TO postgres;

-- Table: public."ProductGrouping"

-- DROP TABLE public."ProductGrouping";

CREATE TABLE public."ProductGrouping"
(
    "ProductGroupingId" integer NOT NULL DEFAULT nextval('"ProductGrouping_ProductGroupingId_seq"'::regclass),
    "ProductGroupingName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "ProductGroupingDescription" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "ProductGroupingOrder" integer NOT NULL,
    CONSTRAINT "ProductGrouping_pkey" PRIMARY KEY ("ProductGroupingId") USING INDEX TABLESPACE ffco,
    CONSTRAINT "ProductGroupingName" UNIQUE ("ProductGroupingName") USING INDEX TABLESPACE ffco
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."ProductGrouping"
    OWNER to postgres;

-- ********************************************************************************
-- DROP SEQUENCE public."ProductUnit_ProductUnitId_seq"; 

CREATE SEQUENCE public."ProductUnit_ProductUnitId_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."ProductUnit_ProductUnitId_seq"
    OWNER TO postgres;

-- Table: public."ProductUnit"

-- DROP TABLE public."ProductUnit";

CREATE TABLE public."ProductUnit"
(
    "ProductUnitId" integer NOT NULL DEFAULT nextval('"ProductUnit_ProductUnitId_seq"'::regclass),
    "ProductUnitName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "ProductUnitDescription" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "ProductUnit_pkey" PRIMARY KEY ("ProductUnitId") USING INDEX TABLESPACE ffco,
    CONSTRAINT "ProductUnitName" UNIQUE ("ProductUnitName") USING INDEX TABLESPACE ffco
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."ProductUnit"
    OWNER to postgres;

-- ********************************************************************************
-- DROP SEQUENCE public."Product_ProductId_seq"; 

CREATE SEQUENCE public."Product_ProductId_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."Product_ProductId_seq"
    OWNER TO postgres;

-- Table: public."Product"

-- DROP TABLE public."Product";

CREATE TABLE public."Product"
(
    "ProductId" integer NOT NULL DEFAULT nextval('"Product_ProductId_seq"'::regclass),
    "ProductName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "ProductDescription" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "ProductPrice" numeric(10, 2) NOT NULL,
    "ProductGroupingId" integer NOT NULL,
    "ProductUnitId" integer NOT NULL,
    "ProductOrder" integer NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductId") USING INDEX TABLESPACE ffco,
    CONSTRAINT "ProductName" UNIQUE ("ProductName") USING INDEX TABLESPACE ffco,
    CONSTRAINT "ProductGroupingId" FOREIGN KEY ("ProductGroupingId")
        REFERENCES public."ProductGrouping" ("ProductGroupingId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "ProductUnitId" FOREIGN KEY ("ProductUnitId")
        REFERENCES public."ProductUnit" ("ProductUnitId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."Product"
    OWNER to postgres;

-- ********************************************************************************
-- DROP SEQUENCE public."SalesTransactionStatus_SalesTransactionStatusId_seq"; 

CREATE SEQUENCE public."SalesTransactionStatus_SalesTransactionStatusId_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."SalesTransactionStatus_SalesTransactionStatusId_seq"
    OWNER TO postgres;

-- Table: public."SalesTransactionStatus"

-- DROP TABLE public."SalesTransactionStatus";

CREATE TABLE public."SalesTransactionStatus"
(
    "SalesTransactionStatusId" integer NOT NULL DEFAULT nextval('"SalesTransactionStatus_SalesTransactionStatusId_seq"'::regclass),
    "SalesTransactionStatusName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "SalesTransactionStatusDescription" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "SalesTransactionStatus_pkey" PRIMARY KEY ("SalesTransactionStatusId") USING INDEX TABLESPACE ffco,
    CONSTRAINT "SalesTransactionStatusName" UNIQUE ("SalesTransactionStatusName") USING INDEX TABLESPACE ffco
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."SalesTransactionStatus"
    OWNER to postgres;

-- ********************************************************************************
-- DROP SEQUENCE public."SalesTransaction_SalesTransactionId_seq"; 

CREATE SEQUENCE public."SalesTransaction_SalesTransactionId_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE public."SalesTransaction_SalesTransactionId_seq"
    OWNER TO postgres;

-- Table: public."SalesTransaction"

-- DROP TABLE public."SalesTransaction";

CREATE TABLE public."SalesTransaction"
(
    "SalesTransactionId" integer NOT NULL DEFAULT nextval('"SalesTransaction_SalesTransactionId_seq"'::regclass),
    "SalesTransactionDateTime" timestamp without time zone NOT NULL,
    "SalesTransactionTotal" numeric(10, 2) NOT NULL,
    "SalesTransactionActual" numeric(10, 2) NOT NULL,
    "SalesTransactionStatusId" integer NOT NULL,
    "SalesTransactionUserId" integer NOT NULL,
    "SalesTransactionMachineName" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "SalesTransaction_pkey" PRIMARY KEY ("SalesTransactionId") USING INDEX TABLESPACE ffco,
    CONSTRAINT "SalesTransactionStatusId" FOREIGN KEY ("SalesTransactionStatusId")
        REFERENCES public."SalesTransactionStatus" ("SalesTransactionStatusId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "SalesTransactionUserId" FOREIGN KEY ("SalesTransactionUserId")
        REFERENCES public."User" ("UserId") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."SalesTransaction"
    OWNER to postgres;

/*  maintenance
    2017/1/15 added status
    ALTER TABLE public."SalesTransaction" ADD COLUMN "SalesTransactionStatus" integer NOT NULL;
*/

-- ********************************************************************************
-- Table: public."SalesTransactionDetail"

-- DROP TABLE public."SalesTransactionDetail";

CREATE TABLE public."SalesTransactionDetail"
(
    "SalesTransactionId" integer NOT NULL,
    "SalesTransactionProductId" integer NOT NULL,
    "SalesTransactionQuantity" numeric(10, 2) NOT NULL,
    "SalesTransactionPrice" numeric(10, 2) NOT NULL,
    CONSTRAINT "SalesTransactionDetail_pkey" PRIMARY KEY ("SalesTransactionId", "SalesTransactionProductId")  USING INDEX TABLESPACE ffco
)
WITH (
    OIDS = FALSE
)
TABLESPACE ffco;

ALTER TABLE public."SalesTransactionDetail"
    OWNER to postgres;
    
-- end

