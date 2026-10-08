import express from 'express';
import cor from 'cors';
import mysql from 'mysql2';
const PORT = 3000;
const app = express();
app.use(cor());
app.use(express.json());
//db connection and validation
const db =mysql.createConnection({
    database: 'ornella',
    host: 'localhost',
    user: 'root',
    password: ''
});
db.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

 app.get('/', (req, res) => {
    res.send('Hello World');
 });
 app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database is connected`);
 });


 //crud oparations
 app.post('/students', (req, res) => {
    const {name, age} = req.body;
    const sql = 'INSERT INTO brave (name, age) VALUES (?, ?)';
    db.query(sql, [name, age], (err, result) => {
        if (err) {
            console.log('Error inserting student:', err);
            res.status(500).send('Error inserting student');
        } else {
            res.status(201).send('Student inserted successfully');
        }
    });
 });

 //get students
 app.get('/students', (req, res) => {
    const {name} = req.query;
    const sql = 'SELECT * FROM brave WHERE name = ?';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log('Error fetching students:', err);
            res.status(500).send('Error fetching students');
        } else {
            res.status(200).json(result);
        }
 });
 });
// Delete student by name
app.delete('/students/:name', (req, res) => {
    const { name } = req.params;

    const sql = 'DELETE FROM brave WHERE name = ?';

    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log('Error deleting student:', err);
            return res.status(500).send('Error deleting student');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Student not found');
        }

        res.status(200).send('Student deleted successfully');
    });
});

//update student by name
app.put('/students/:name', (req, res) => {
    const { name } = req.params;
    const { age } = req.body;
    const sql = 'UPDATE brave SET age = ? WHERE name = ?';
    db.query(sql, [age, name], (err, result) => {
        if (err) {
            console.log('Error updating student:', err);
            res.status(500).send('Error updating student');
        } else {
            res.status(200).send('Student updated successfully');
        }
    });
});