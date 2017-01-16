-- some sample rows to get started

-- use this to clean up the table
-- truncate table public."User" cascade;

INSERT INTO public."User"(
	"UserId", "UserName", "UserFirstName", "UserLastName")
	VALUES (nextval('public."User_UserId_seq"'), 'wbailey0@imdb.com', 'William', 'Bailey');

-- end