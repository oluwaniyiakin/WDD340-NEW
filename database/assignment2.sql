-- 1. Insert a new record into the "account" table
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify the "Tony Stark" record to change the "account_type" to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

-- 3. Delete the "Tony Stark" record from the database
DELETE FROM account
WHERE email = 'tony@starkent.com';

-- 4. Modify the "GM Hummer" record's description using PostgreSQL's REPLACE function
UPDATE inventory
SET description = REPLACE(description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- 5. Use an INNER JOIN to select "make" and "model" from "inventory" and "classification_name" from "classification" 
-- for inventory items that belong to the "Sport" category
SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update all records in the "inventory" table to add "/vehicles" to the middle of the file paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
