-- some sample rows to get started

INSERT INTO public."User"(
	"UserId", "UserName", "UserFirstName", "UserLastName")
	VALUES (nextval('public."User_UserId_seq"'), 'wbailey0@imdb.com', 'William', 'Bailey');

-- end