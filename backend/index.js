const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const mysql = require("mysql");

const secret = 'hamail@101';

const db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    database: 'rolebased',
    password: 'MyNewPass'
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173', // Allow only this origin to access the server
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allow only these methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
}));

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Middleware to authorize only admin
const authorizeAdmin = (req, res, next) => {
    if (req.user.role_id !== 1) return res.sendStatus(403);
    next();
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users u JOIN roletb r ON u.role_id = r.id WHERE email = ? AND password = ?;';
    
    db.query(sql, [email, password], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const user = results[0];
      const token = jwt.sign({ id: user.id, role_id: user.role_id }, secret, { expiresIn: '1h' });
      
      res.json({ token, role_id: user.role_id, name: user.name, id: user.id }); 
    });
});

app.get("/users", authenticateToken, (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get("/users/tasksshow", authenticateToken, authorizeAdmin, (req, res) => {
    const sql = `SELECT u.id, u.name, t.task_name FROM users u LEFT JOIN tasks t ON u.id = t.userid WHERE u.role_id = 2 AND t.task_name = ''`; // WHERE t.task_name = ''`;
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get("/users/completedshow", authenticateToken, authorizeAdmin, (req, res) => {
    const sql = `SELECT name, completed_tasks FROM users WHERE role_id = 2`;
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.get("/users/tasksshow/:id", authenticateToken, (req, res) => {
    const id = Number(req.params.id);
    const sql = `SELECT t.task_name FROM users u LEFT JOIN tasks t ON u.id = t.userid WHERE u.role_id = 2 AND u.id = ${id} AND t.task_name != ''`; // WHERE t.task_name = ''`;
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.patch('/users/updatetask/:id', authenticateToken, authorizeAdmin, (req, res) => {
    const id = Number(req.params.id);
    const { task_name } = req.body;
    const sql = `UPDATE tasks SET task_name = ? WHERE userid = ?`;
    db.query(sql, [task_name, id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: "Failed to update user data" });
        return res.json({ status: "success", message: "User updated successfully" });
    });
});

app.patch('/users/updatestate/:id', authenticateToken, (req, res) => {
    const id = Number(req.params.id);

    const sqlInsertHistory = `
        INSERT INTO taskhistory (taskid, userid, Date, stateid)
        SELECT t.id, t.userid, CURDATE(), s.id
        FROM tasks t
        JOIN states s ON s.name = 'completed'
        WHERE t.id = ?
    `;
    
    const sqlUpdateTaskName = `UPDATE tasks SET task_name = '' WHERE id = ?`;

    const sqlIncrementCompletedTasks = `
        UPDATE users u
        JOIN tasks t ON u.id = t.userid
        SET u.completed_tasks = u.completed_tasks + 1
        WHERE t.userid = ?
    `;

    db.query(sqlInsertHistory, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Failed to insert task history" });
        }

        db.query(sqlUpdateTaskName, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Failed to update task name" });
            }

            db.query(sqlIncrementCompletedTasks, [id], (err, result) => {
                if (err) {
                    return res.status(500).json({ status: "error", message: "Failed to increment completed tasks count" });
                }
                return res.json({ status: "success", message: "Task updated, history recorded, and task name deleted successfully" });
            });
        });
    });
});

// app.patch('/users/updatestate/:id', authenticateToken, (req, res) => {
//     const id = Number(req.params.id);
//     const sqlInsertHistory = `
//         INSERT INTO history (taskid, userid, Date, stateid)
//         SELECT t.id, t.userid, CURDATE(), s.id
//         FROM tasks t
//         JOIN states s ON s.name = 'completed'
//         WHERE t.id = ?
//     `;
    
//     db.query(sqlInsertHistory, [id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ status: "error", message: "Failed to insert task history" });
//         }
//         const sqlDeleteTaskName = `UPDATE tasks SET task_name = '' WHERE userid = ?`;
//         db.query(sqlDeleteTaskName, [id], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ status: "error", message: "Failed to delete task name" });
//             }
//             return res.json({ status: "success", message: "Task updated, history recorded, and task name deleted successfully" });
//         });
//     });
// });

app.route('/users/:name')
    .get(authenticateToken, (req, res) => { // Protecting the route
        const name = req.params.name;
        const sql = `SELECT * FROM users WHERE name LIKE '%${name}%'`;
        db.query(sql, (err, data) => {
            if (err) return res.status(404).json({ status: "error", message: "User not found" });
            return res.json(data);
        });
    });

app.route('/users/:id')
    .get(authenticateToken, (req, res) => { // Protecting the route
        const id = Number(req.params.id);
        const sql = `SELECT * FROM users WHERE id = ${id}`;
        db.query(sql, (err, data) => {
            if (err) return res.status(404).json({ status: "error", message: "User not found" });
            return res.json(data);
        });
    })
    .patch(authenticateToken, authorizeAdmin, (req, res) => { // Protecting the route
        const id = Number(req.params.id);
        const updatedData = req.body;
        const sql = `UPDATE users SET ? WHERE id = ?`;

        db.query(sql, [updatedData, id], (err, result) => {
            if (err) return res.status(500).json({ status: "error", message: "Failed to update user data" });
            return res.json({ status: "success", message: "User updated successfully" });
        });
    })
    .delete(authenticateToken, authorizeAdmin, (req, res) => { // Protecting the route
        const id = Number(req.params.id);
        const sql = `DELETE FROM users WHERE id = ?`;

        db.query(sql, [id], (err, result) => {
            if (err) return res.status(500).json({ status: "error", message: "Failed to delete user data" });
            return res.json({ status: "success", message: "User deleted successfully" });
        });
    });

app.post("/users", authenticateToken, authorizeAdmin, (req, res) => { // Protecting the route
    const newUser = req.body;
    const sql = `INSERT INTO users SET ?`;

    db.query(sql, newUser, (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: "Failed to add new user" });
        return res.json({ status: "success", id: result.insertId });
    });
});

app.listen(3000, () => {
    console.log("Listening...");
});