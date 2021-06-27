const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env'})

const app = express();

const db = mysql.createConnection({
	host: process.env.DATABASE_HOST, 
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE
	//host: 'localhost',
	//user: 'root',
	//password: '',
	//database: 'wap9_login'
});

const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.set('views', './views');
app.set('view engine', 'hbs');

db.connect( (error) => {
	if(error) {
		console.log(error);
	}
	else {
		console.log("MYSQL Connected!");
	}
})

//Define Routes
app.use('/', require('./routes/pages.js'));
app.use('/auth', require('./routes/auth.js'));

app.listen(3030, () => {
	console.log("Server started on Port 3030");
})