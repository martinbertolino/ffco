-- some sample rows to get started

/*
use this to clean up the tables

truncate table public."User" cascade;

truncate table public."SalesTransactionStatus" cascade;
truncate table public."Product" cascade;
truncate table public."ProductUnit" cascade;
truncate table public."ProductGrouping" cascade;
truncate table public."User" cascade;

select * from public."User";
select * from public."ProductGrouping";
select * from public."ProductUnit";
select * from public."Product";
select * from public."SalesTransactionStatus";

*/

/*
select * from public."User";
select * from public."User" order by "UserName" desc;
*/

INSERT INTO public."User"(
	"UserId", "UserName", "UserFirstName", "UserLastName")
	VALUES (nextval('public."User_UserId_seq"'), 'wbailey0@imdb.com', 'William', 'Bailey');

-- alternate, no sequence, use default value
/* 
INSERT INTO public."User"(
	"UserName", "UserFirstName", "UserLastName")
	VALUES ('wbailey0@imdb.com', 'William', 'Bailey');
*/


-- create some sample product groupings

/*
select * from public."ProductGrouping";
delete from public."ProductGrouping";
*/

INSERT INTO public."ProductGrouping"(
	"ProductGroupingId", "ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder")
	VALUES (nextval('public."ProductGrouping_ProductGroupingId_seq"'), 'ADULT', 'Adult Group', 0);

INSERT INTO public."ProductGrouping"(
	"ProductGroupingId", "ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder")
	VALUES (nextval('public."ProductGrouping_ProductGroupingId_seq"'), 'CHILD', 'Children Group', 1);

INSERT INTO public."ProductGrouping"(
	"ProductGroupingId", "ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder")
	VALUES (nextval('public."ProductGrouping_ProductGroupingId_seq"'), 'BULK', 'Bulk Group', 2);

-- create some sample product units

/*
select * from public."ProductUnit";
delete from public."ProductUnit";
*/

INSERT INTO public."ProductUnit"(
	"ProductUnitId", "ProductUnitName", "ProductUnitDescription")
	VALUES (nextval('public."ProductUnit_ProductUnitId_seq"'), 'ORDER', 'Order(s)');

INSERT INTO public."ProductUnit"(
	"ProductUnitId", "ProductUnitName", "ProductUnitDescription")
	VALUES (nextval('public."ProductUnit_ProductUnitId_seq"'), 'LB', 'Pound(s)');

-- create some products, match previous screenshot

/*
select * from public."Product";
delete from public."Product";
*/

-- Adult

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'FISH-ADULT-ORDER', 
		'Fish', 
		11.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'ADULT'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		0);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'EXTRA-FISH-ADULT-ORDER', 
		'Extra Fish', 
		13.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'ADULT'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		1);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'SHRIMP-ADULT-ORDER', 
		'Shrimp', 
		13.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'ADULT'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		2);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'EXTRA-SHRIMP-ADULT-ORDER', 
		'Extra Shrimp', 
		13.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'ADULT'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		3);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'COMBO-ADULT-ORDER', 
		'Combo', 
		11.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'ADULT'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		4);

-- Children

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'FISH-CHILD-ORDER', 
		'Fish', 
		6.50, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'CHILD'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		10);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'SHRIMP-CHILD-ORDER', 
		'Shrimp', 
		6.50, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'CHILD'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		11);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'COMBO-CHILD-ORDER', 
		'Combo', 
		6.50, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'CHILD'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		12);

-- Bulk

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'FISH-BULK-ORDER', 
		'Fish', 
		20.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'BULK'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		20);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'SHRIMP-BULK-ORDER', 
		'Shrimp', 
		20.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'BULK'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		21);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'SPAGHETTI-BULK-ORDER', 
		'Spaghetti', 
		3.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'BULK'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		22);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'FF-BULK-ORDER', 
		'French Fries', 
		3.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'BULK'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		23);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'APLSCE-BULK-ORDER', 
		'Apple Sauce', 
		3.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'BULK'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		24);

INSERT INTO public."Product"(
	"ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES (
		nextval('public."Product_ProductId_seq"'), 
		'SLAW-BULK-ORDER', 
		'Slaw', 
		4.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'BULK'), 
		(select "ProductUnitId" from public."ProductUnit" where "ProductUnitName" = 'ORDER'), 
		25);

-- Transaction Status
-- select * from public."SalesTransactionStatus";
-- delete from public."SalesTransactionStatus";

INSERT INTO public."SalesTransactionStatus"(
	"SalesTransactionStatusId", "SalesTransactionStatusName", "SalesTransactionStatusDescription")
	VALUES (
		nextval('public."SalesTransactionStatus_SalesTransactionStatusId_seq"'), 
		'OK', 
		'Billed Transaction');

INSERT INTO public."SalesTransactionStatus"(
	"SalesTransactionStatusId", "SalesTransactionStatusName", "SalesTransactionStatusDescription")
	VALUES (
		nextval('public."SalesTransactionStatus_SalesTransactionStatusId_seq"'), 
		'VOID', 
		'Voided Transaction');

INSERT INTO public."SalesTransactionStatus"(
	"SalesTransactionStatusId", "SalesTransactionStatusName", "SalesTransactionStatusDescription")
	VALUES (
		nextval('public."SalesTransactionStatus_SalesTransactionStatusId_seq"'), 
		'FREE', 
		'Free Transaction');

/*
final check of all the base data

select * from public."User";
select * from public."ProductGrouping";
select * from public."ProductUnit";
select * from public."Product";
select * from public."SalesTransactionStatus";

select * from public."User" as usr;

select usr."UserLastName" from public."User" as usr;



select "ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder" from public."Product";

select "ProductId", "ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder" from public."Product"
inner join public."ProductGrouping" on (public."Product"."ProductGroupingId" = pg."ProductGroupingId");


select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", p."ProductGroupingId", p."ProductUnitId", p."ProductOrder" from public."Product" as p
inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId");

select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", p."ProductGroupingId", pg."ProductGroupingName", p."ProductUnitId", p."ProductOrder" from public."Product" as p
inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId");

select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", p."ProductGroupingId", pg."ProductGroupingName", p."ProductUnitId", pu."ProductUnitName", p."ProductOrder" from public."Product" as p
inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId")
inner join public."ProductUnit" as pu on (p."ProductUnitId" = pu."ProductUnitId");

select p."ProductId", p."ProductName", p."ProductDescription", p."ProductPrice", pg."ProductGroupingName", pu."ProductUnitName", p."ProductOrder" from public."Product" as p
inner join public."ProductGrouping" as pg on (p."ProductGroupingId" = pg."ProductGroupingId")
inner join public."ProductUnit" as pu on (p."ProductUnitId" = pu."ProductUnitId");

*/

-- end

