-- Create Employee Table 
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
	emp_id INT AUTO_INCREMENT,
  	emp_name VARCHAR(40),
  	manager_id INT,
  	PRIMARY KEY (emp_id),
  	FOREIGN KEY (manager_id) REFERENCES employee(emp_id) ON DELETE SET NULL
);


INSERT INTO employee VALUES(101, 'Anish Shah', NULL);
INSERT INTO employee VALUES(102, 'Raghuram Velega', 101);
INSERT INTO employee VALUES(103, 'Vastav Vijay', 102);
INSERT INTO employee VALUES(104, 'Ahmar Abdullah', 103);
INSERT INTO employee VALUES(105, 'Ajun Nair', 103);
INSERT INTO employee VALUES(106, 'Kandhadai Sreekar', 103);
INSERT INTO employee VALUES(107, 'Khushdev Pandit', 103);
INSERT INTO employee VALUES(108, 'Nishant Deheriya', 103);
INSERT INTO employee VALUES(109, 'Rahul Dubal', 103);
INSERT INTO employee VALUES(110, 'Sai Kumarri', 108);
--SELECT * FROM Employee;


-- Create Attendence Table
DROP TABLE IF EXISTS attendence;
CREATE TABLE attendence(
	emp_id INT ,
  	day DATE,
  	punch_in TIME,
  	punch_out TIME,
	PRIMARY KEY (emp_id, day),
   	FOREIGN KEY(emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE
);

INSERT INTO attendence VALUES(101, '2023-06-12', '10:01:00', '17:05:00');
INSERT INTO attendence VALUES(101, '2023-06-13', '11:01:00', '17:06:00');
INSERT INTO attendence VALUES(101, '2023-06-14', '09:30:00', '16:07:00');
INSERT INTO attendence VALUES(102, '2023-06-12', '10:00:00', '17:40:00');
INSERT INTO attendence VALUES(102, '2023-06-13', '09:59:00', '17:43:00');
INSERT INTO attendence VALUES(102, '2023-06-14', '09:23:00', '16:57:00');
INSERT INTO attendence VALUES(103, '2023-06-12', '09:01:00', '17:54:00');
INSERT INTO attendence VALUES(103, '2023-06-13', '09:02:00', '17:44:00');
INSERT INTO attendence VALUES(103, '2023-06-14', '09:03:00', '17:30:00');
INSERT INTO attendence VALUES(104, '2023-06-12', '09:11:00', '17:54:00');
INSERT INTO attendence VALUES(104, '2023-06-13', '09:12:00', '17:44:00');
INSERT INTO attendence VALUES(104, '2023-06-14', '09:13:00', '17:30:00');
INSERT INTO attendence VALUES(105, '2023-06-12', '09:30:00', '18:25:00');
INSERT INTO attendence VALUES(105, '2023-06-13', '09:32:00', '18:31:00');
INSERT INTO attendence VALUES(105, '2023-06-14', '09:43:00', '18:45:00');
INSERT INTO attendence VALUES(106, '2023-06-12', '09:30:00', '18:25:00');
INSERT INTO attendence VALUES(106, '2023-06-13', '09:32:00', '18:31:00');
INSERT INTO attendence VALUES(106, '2023-06-14', '09:43:00', '18:45:00');
INSERT INTO attendence VALUES(107, '2023-06-12', '08:30:00', '17:25:00');
INSERT INTO attendence VALUES(107, '2023-06-13', '08:32:00', '17:31:00');
INSERT INTO attendence VALUES(107, '2023-06-14', '08:43:00', '16:45:00');
INSERT INTO attendence VALUES(108, '2023-06-12', '08:30:00', '17:25:00');
INSERT INTO attendence VALUES(108, '2023-06-13', '08:32:00', '17:31:00');
INSERT INTO attendence VALUES(108, '2023-06-14', '08:43:00', '16:45:00');
INSERT INTO attendence VALUES(109, '2023-06-12', '08:00:00', '16:49:00');
INSERT INTO attendence VALUES(109, '2023-06-13', '08:02:00', '17:00:00');
INSERT INTO attendence VALUES(109, '2023-06-14', '08:10:00', '17:05:00');
INSERT INTO attendence VALUES(110, '2023-06-12', '08:01:00', '16:50:00');
INSERT INTO attendence VALUES(110, '2023-06-13', '08:02:00', '17:02:00');
INSERT INTO attendence VALUES(110, '2023-06-14', '08:11:00', '17:06:00');


/*
* Recursive sql query to list the attendence of all employees whose manager is manager_id either directly or indirectly
*/
CREATE TABLE attendence_hierarchy AS
WITH RECURSIVE employee_hierarchy AS (
    SELECT emp_id, emp_name, manager_id
    FROM employee
    WHERE emp_id = 101
    UNION ALL
    SELECT e.emp_id, e.emp_name, e.manager_id
    FROM employee e
    JOIN employee_hierarchy eh ON e.manager_id = eh.emp_id
)
SELECT eh.emp_id, eh.emp_name, a.day, a.punch_in, a.punch_out
FROM employee_hierarchy eh
JOIN attendence a ON eh.emp_id = a.emp_id
ORDER BY a.day, a.punch_in, a.punch_out;


/*
* Separate the details using comma
*/
-- Method-1 by combining the recursive query with the main query
SELECT emp_id, emp_name,
GROUP_CONCAT(day) AS day,
GROUP_CONCAT(punch_in) AS punch_in,
GROUP_CONCAT(punch_out) AS punch_out
FROM (
	WITH RECURSIVE employee_hierarchy AS (
			SELECT emp_id, emp_name, manager_id
			FROM employee
			WHERE emp_id = 101
			UNION ALL
			SELECT e.emp_id, e.emp_name, e.manager_id
			FROM employee e
			JOIN employee_hierarchy eh ON e.manager_id = eh.emp_id
	)
	SELECT eh.emp_id, eh.emp_name, a.day, a.punch_in, a.punch_out
	FROM employee_hierarchy eh
	JOIN attendence a ON eh.emp_id = a.emp_id
	ORDER BY a.day, a.punch_in, a.punch_out
)
GROUP BY emp_id;


-- Method-2 by saving the result of recursive query in a table
DROP TABLE IF EXISTS attendence_hierarchy;

CREATE TABLE attendence_hierarchy AS
WITH RECURSIVE employee_hierarchy AS (
    SELECT emp_id, emp_name, manager_id
    FROM employee
    WHERE emp_id = 101
    UNION ALL
    SELECT e.emp_id, e.emp_name, e.manager_id
    FROM employee e
    JOIN employee_hierarchy eh ON e.manager_id = eh.emp_id
)
SELECT eh.emp_id, eh.emp_name, a.day, a.punch_in, a.punch_out
FROM employee_hierarchy eh
JOIN attendence a ON eh.emp_id = a.emp_id
ORDER BY a.day, a.punch_in, a.punch_out;


SELECT emp_id, emp_name,
GROUP_CONCAT(day) AS day,
GROUP_CONCAT(punch_in) AS punch_in,
GROUP_CONCAT(punch_out) AS punch_out
FROM attendence_hierarchy
GROUP BY emp_id;



