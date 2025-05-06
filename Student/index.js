const  express = require("express");
const cors = require("cors");
const pool = require("./db");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req, res)=>{
    try{
        res.json("Welcome To Student API");
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

app.get('/student', async(req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM student');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

app.get('/allData', async(req, res)=>{
    try{
        const result = await pool.query('SELECT count(employee_id) FROM employees');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

app.get('/gettotalstd', async(req, res)=>{
    try{
        const result = await pool.query('SELECT COUNT(ID) FROM student');
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 50) Find job history records with employee, job, and country details
app.get('/employeeJobHistoryWithCountry', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT jh.*, e.first_name, e.last_name, j.job_title, c.country_name 
            FROM job_history jh
            JOIN employees e ON jh.employee_id = e.employee_id
            JOIN jobs j ON jh.job_id = j.job_id
            JOIN departments d ON jh.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            JOIN countries c ON l.country_id = c.country_id
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 51) Retrieve regions along with their countries and locations
app.get('/regionsWithCountriesAndLocations', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT r.region_id, r.region_name, c.country_id, c.country_name, 
                   l.location_id, l.street_address, l.city, l.state_province
            FROM regions r
            JOIN countries c ON r.region_id = c.region_id
            JOIN locations l ON c.country_id = l.country_id
            ORDER BY r.region_id, c.country_name, l.city
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 52) Find countries along with their regions and locations
app.get('/countriesWithRegionsAndLocations', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT c.country_id, c.country_name, r.region_id, r.region_name, 
                   l.location_id, l.street_address, l.city, l.state_province
            FROM countries c
            JOIN regions r ON c.region_id = r.region_id
            JOIN locations l ON c.country_id = l.country_id
            ORDER BY c.country_name, l.city
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 53) Retrieve locations along with their countries and regions
app.get('/locationsWithCountriesAndRegions', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT l.location_id, l.street_address, l.city, l.state_province, 
                   c.country_id, c.country_name, r.region_id, r.region_name
            FROM locations l
            JOIN countries c ON l.country_id = c.country_id
            JOIN regions r ON c.region_id = r.region_id
            ORDER BY l.city, c.country_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 54) Find departments along with their employees and locations
app.get('/departmentsWithEmployeesAndLocations', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, e.employee_id, 
                   e.first_name, e.last_name, l.location_id, l.city, l.state_province
            FROM departments d
            JOIN employees e ON d.department_id = e.department_id
            JOIN locations l ON d.location_id = l.location_id
            ORDER BY d.department_name, e.last_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 55) Retrieve employees along with their departments, locations, and countries
app.get('/employeesWithDeptLocCountry', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, 
                   d.department_id, d.department_name, 
                   l.location_id, l.city, l.state_province,
                   c.country_id, c.country_name
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            JOIN countries c ON l.country_id = c.country_id
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 56) Find employees along with their managers, departments, and locations
app.get('/employeesWithManagersDeptLoc', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, 
                   m.employee_id AS manager_id, m.first_name AS manager_first_name, 
                   m.last_name AS manager_last_name,
                   d.department_id, d.department_name,
                   l.location_id, l.city, l.state_province
            FROM employees e
            LEFT JOIN employees m ON e.manager_id = m.employee_id
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 57) Retrieve employees along with their job titles, departments, and locations
app.get('/employeesWithJobDeptLoc', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, 
                   j.job_id, j.job_title,
                   d.department_id, d.department_name,
                   l.location_id, l.city, l.state_province
            FROM employees e
            JOIN jobs j ON e.job_id = j.job_id
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 58) Find employees along with their job titles, departments, and managers
app.get('/employeesWithJobDeptManager', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, 
                   j.job_id, j.job_title,
                   d.department_id, d.department_name,
                   m.employee_id AS manager_id, m.first_name AS manager_first_name, 
                   m.last_name AS manager_last_name
            FROM employees e
            JOIN jobs j ON e.job_id = j.job_id
            JOIN departments d ON e.department_id = d.department_id
            LEFT JOIN employees m ON e.manager_id = m.employee_id
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// All Jobs
app.get('/allData', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT * FROM jobs
        `);
        const result2 = await pool.query(`
            SELECT * FROM regions
        `);
        const result3 = await pool.query(`
            SELECT * FROM regions
        `);
        res.json({result : result.rows, result2 : result2.rows });
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 59) Retrieve employees along with their job titles, departments, managers, and locations
app.get('/employeesWithJobDeptManagerLoc', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, 
                   j.job_id, j.job_title,
                   d.department_id, d.department_name,
                   m.employee_id AS manager_id, m.first_name AS manager_first_name, 
                   m.last_name AS manager_last_name,
                   l.location_id, l.city, l.state_province
            FROM employees e
            JOIN jobs j ON e.job_id = j.job_id
            JOIN departments d ON e.department_id = d.department_id
            LEFT JOIN employees m ON e.manager_id = m.employee_id
            JOIN locations l ON d.location_id = l.location_id
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 60) Retrieve the names of countries in Region 1
app.get('/countriesInRegion1', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT country_id, country_name
            FROM countries
            WHERE region_id = 1
            ORDER BY country_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 61) Find the departments located in cities starting with 'N'
app.get('/departmentsInCitiesStartingWithN', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, l.city
            FROM departments d
            JOIN locations l ON d.location_id = l.location_id
            WHERE l.city LIKE 'N%'
            ORDER BY l.city, d.department_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 62) Select employees who work in departments managed by employees with a commission percentage greater than 0.15
app.get('/employeesUnderHighCommissionManagers', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.department_id, d.department_name
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            JOIN employees manager ON d.manager_id = manager.employee_id
            WHERE manager.commission_pct > 0.15
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 63) Get the job titles of employees who are managers
app.get('/managerJobTitles', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT DISTINCT j.job_id, j.job_title
            FROM jobs j
            JOIN employees e ON j.job_id = e.job_id
            WHERE e.employee_id IN (
                SELECT DISTINCT manager_id 
                FROM employees 
                WHERE manager_id IS NOT NULL
            )
            ORDER BY j.job_title
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 64) Retrieve the postal codes of locations where the country's region name is 'Asia'
app.get('/postalCodesInAsia', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT l.location_id, l.postal_code, l.city, c.country_name
            FROM locations l
            JOIN countries c ON l.country_id = c.country_id
            JOIN regions r ON c.region_id = r.region_id
            WHERE r.region_name = 'Asia'
            ORDER BY c.country_name, l.city
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 65) Select the names of departments that have employees with commission percentages less than the average commission percentage across all departments
app.get('/departmentsWithBelowAvgCommission', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT DISTINCT d.department_id, d.department_name
            FROM departments d
            JOIN employees e ON d.department_id = e.department_id
            WHERE e.commission_pct < (
                SELECT AVG(commission_pct) 
                FROM employees 
                WHERE commission_pct IS NOT NULL
            )
            ORDER BY d.department_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 66) Retrieve the job titles of employees whose salary is higher than the average salary of employees in the same department
app.get('/jobTitlesAboveDeptAvgSalary', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT DISTINCT j.job_id, j.job_title
            FROM jobs j
            JOIN employees e ON j.job_id = e.job_id
            WHERE e.salary > (
                SELECT AVG(salary)
                FROM employees e2
                WHERE e2.department_id = e.department_id
            )
            ORDER BY j.job_title
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 67) Find the IDs of employees who have not been assigned to any department
app.get('/employeesWithNoDepartment', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT employee_id, first_name, last_name
            FROM employees
            WHERE department_id IS NULL
            ORDER BY last_name, first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 68) Get the names of employees who have held more than one job position (multiple entries in the job history table)
app.get('/employeesWithMultipleJobs', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, COUNT(jh.job_id) AS job_count
            FROM employees e
            JOIN job_history jh ON e.employee_id = jh.employee_id
            GROUP BY e.employee_id, e.first_name, e.last_name
            HAVING COUNT(jh.job_id) > 1
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 69) Retrieve the count of employees in each department
app.get('/employeeCountByDepartment', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, COUNT(e.employee_id) AS employee_count
            FROM departments d
            LEFT JOIN employees e ON d.department_id = e.department_id
            GROUP BY d.department_id, d.department_name
            ORDER BY employee_count DESC, d.department_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 70) Find the total salary for each job title
app.get('/totalSalaryByJobTitle', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT j.job_id, j.job_title, SUM(e.salary) AS total_salary
            FROM jobs j
            LEFT JOIN employees e ON j.job_id = e.job_id
            GROUP BY j.job_id, j.job_title
            ORDER BY total_salary DESC, j.job_title
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 71) Get the average commission percentage for each department
app.get('/avgCommissionByDepartment', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT d.department_id, d.department_name, 
                   AVG(e.commission_pct) AS avg_commission_pct
            FROM departments d
            LEFT JOIN employees e ON d.department_id = e.department_id
            GROUP BY d.department_id, d.department_name
            ORDER BY avg_commission_pct DESC NULLS LAST, d.department_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 72) Retrieve the maximum salary in each country
app.get('/maxSalaryByCountry', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT c.country_id, c.country_name, MAX(e.salary) AS max_salary
            FROM countries c
            JOIN locations l ON c.country_id = l.country_id
            JOIN departments d ON l.location_id = d.location_id
            JOIN employees e ON d.department_id = e.department_id
            GROUP BY c.country_id, c.country_name
            ORDER BY max_salary DESC, c.country_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// Write a query to display those employees who contain a letter z to their first name and also display their last name, department, city, and state province
app.get('/employeesWithZInFirstName', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, 
                   d.department_name, l.city, l.state_province
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            WHERE e.first_name LIKE '%z%'
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 73) Write a query to display the job title, department name, full name (first and last name) of the employee, and starting date for all the jobs that started on or after 1st January 1993 and ending with on or before 31 August 1997
app.get('/jobsInSpecificDateRange', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT j.job_title, d.department_name, 
                   e.first_name || ' ' || e.last_name AS employee_name,
                   jh.start_date
            FROM job_history jh
            JOIN employees e ON jh.employee_id = e.employee_id
            JOIN jobs j ON jh.job_id = j.job_id
            JOIN departments d ON jh.department_id = d.department_id
            WHERE jh.start_date >= '1993-01-01' 
              AND jh.end_date <= '1997-08-31'
            ORDER BY jh.start_date, e.last_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 74) Write a query to display the country name, city, and number of those departments where at least 2 employees are working
app.get('/countriesCitiesWithTwoOrMoreEmployees', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT c.country_name, l.city, COUNT(DISTINCT d.department_id) AS department_count
            FROM countries c
            JOIN locations l ON c.country_id = l.country_id
            JOIN departments d ON l.location_id = d.location_id
            JOIN employees e ON d.department_id = e.department_id
            GROUP BY c.country_name, l.city, d.department_id
            HAVING COUNT(e.employee_id) >= 2
            ORDER BY c.country_name, l.city
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 75) Write a query to display full name (first and last name), job title, and starting and ending date of last jobs for those employees with worked without a commission percentage
app.get('/employeesWithoutCommission', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.first_name || ' ' || e.last_name AS employee_name,
                   j.job_title, jh.start_date, jh.end_date
            FROM employees e
            JOIN job_history jh ON e.employee_id = jh.employee_id
            JOIN jobs j ON jh.job_id = j.job_id
            WHERE e.commission_pct IS NULL
            AND jh.end_date = (
                SELECT MAX(end_date)
                FROM job_history
                WHERE employee_id = e.employee_id
            )
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 76) Write a query to display the full name (first and last name) of the employee with ID and name of the country presently where (s)he is working
app.get('/employeesWithCurrentCountry', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name || ' ' || e.last_name AS employee_name,
                   c.country_id, c.country_name
            FROM employees e
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            JOIN countries c ON l.country_id = c.country_id
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 77) Write a query to display the name (first name and last name), salary, and department ID for those employees who earn such an amount of salary which is the smallest salary of any of the departments
app.get('/employeesWithMinDeptSalary', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.first_name, e.last_name, e.salary, e.department_id
            FROM employees e
            JOIN (
                SELECT department_id, MIN(salary) AS min_salary
                FROM employees
                WHERE department_id IS NOT NULL
                GROUP BY department_id
            ) dept_min ON e.department_id = dept_min.department_id AND e.salary = dept_min.min_salary
            ORDER BY e.department_id, e.last_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 78) Write a query to display all the information for those employees whose id is any id who earn the third highest salary
app.get('/employeesWithThirdHighestSalary', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT *
            FROM employees
            WHERE salary = (
                SELECT DISTINCT salary
                FROM employees
                ORDER BY salary DESC
                OFFSET 2 LIMIT 1
            )
            ORDER BY last_name, first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 79) Write a query to display the employee number, name (first name and last name), and salary for all employees who earn more than the average salary and who work in a department with any employee with a J in their name
app.get('/employeesAboveAvgSalaryWithJColleague', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, e.salary
            FROM employees e
            WHERE e.salary > (
                SELECT AVG(salary) FROM employees
            )
            AND e.department_id IN (
                SELECT DISTINCT department_id
                FROM employees
                WHERE first_name LIKE '%J%' OR last_name LIKE '%J%'
            )
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

// 80) Display the employee name (first name and last name), employee ID, and job title for all employees whose department location is Toronto
app.get('/employeesInToronto', async(req, res)=>{
    try{
        const result = await pool.query(`
            SELECT e.employee_id, e.first_name, e.last_name, j.job_title
            FROM employees e
            JOIN jobs j ON e.job_id = j.job_id
            JOIN departments d ON e.department_id = d.department_id
            JOIN locations l ON d.location_id = l.location_id
            WHERE l.city = 'Toronto'
            ORDER BY e.last_name, e.first_name
        `);
        res.json(result.rows);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Connected Successfully...Running on PORT ${PORT}`);
});