-- Insert Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark','tonystarkent.com','Iam1ronM@n');

--Update Tony Stark to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--Delete Tony Stark
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

--Update GN Hammer Description using REPLACE function
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Inner Join for "Sport Category"
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
INNER JOIN public.classification c 
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--Update all image paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

