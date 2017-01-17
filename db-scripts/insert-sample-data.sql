-- some sample rows to get started

-- use this to clean up the table
-- truncate table public."User" cascade;

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
	"ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder")
	VALUES ('ADULT', 'Adult Group', 0);

INSERT INTO public."ProductGrouping"(
	"ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder")
	VALUES ('CHILD', 'Children Group', 1);

INSERT INTO public."ProductGrouping"(
	"ProductGroupingName", "ProductGroupingDescription", "ProductGroupingOrder")
	VALUES ('BULK', 'Bulk Group', 2);

-- create some sample product units

/*
select * from public."ProductUnit";
delete from public."ProductUnit";
*/

INSERT INTO public."ProductUnit"(
	"UnitName", "UnitDescription")
	VALUES ('ORDER', 'Order(s)');

INSERT INTO public."ProductUnit"(
	"UnitName", "UnitDescription")
	VALUES ('LB', 'Pound(s)');

-- create some sample products

/*
select * from public."Product";
delete from public."Product";
*/

INSERT INTO public."Product"(
	"ProductName", "ProductDescription", "ProductPrice", "ProductGroupingId", "ProductUnitId", "ProductOrder")
	VALUES ('FISH-ADULT-ORDER', 'Fish', 11.00, 
		(select "ProductGroupingId" from public."ProductGrouping" where "ProductGroupingName" = 'ADULT'), 
		(select "UnitId" from public."ProductUnit" where "UnitName" = 'ORDER'), 
		0);

-- end

