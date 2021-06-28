const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require("../db");
const dotenv = require("dotenv");
dotenv.config();


exports.logout = (req, res) => {
	req.session.destroy();
	return res.redirect("/");
}

exports.login = async(req, res) => {
	try {
		const {id : email, pwd : password} = req.body;

		if(!email || !password) {
			return res.status(400).json({
				message : 'Please provide email and password'
			});
		}

		db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
			
			if(results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {
				console.log('401 Email or Password is incorrect')
				return res.status(401).json({
					message : 'Email or Password is incorrect '
				});
			}

			const id = results[0].id;
			const user = { id , email, password};
			
			const token = jwt.sign({id}, process.env.JWT_SECRET, {
				expiresIn : process.env.JWT_EXPIRES_IN
			})

			console.log('The token is : ' + token);

			const cookieOptions = {
				expires : new Date(
					Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
				),
				httpOnly : true
			}

			res.cookie('jwt', token, cookieOptions);
			req.session.user = user;
			req.session.logged = true;
			res.status(200).redirect('/');
			
		})

	} catch (error) {
		console.log(error);
		res.status(400).redirect('/auth/login');
	}
}

exports.register = (req, res) => {
	console.log(req.body);

	const {name, email, password, passwordConfirm } = req.body;

	/*위 문장과 동일
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const passwordConfirm = req.body.passwordConfirm;
	*/

	db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
		if(error) {
			console.log(error);
		}

		if(results.length > 0) {
			return res.json({
				message: 'That email is already in use'
			});
		} 
		else if(password != passwordConfirm) {
			return res.json({
				message: 'Password do not match'
			});
		}

		let hashedPassword = await bcrypt.hash(password, 8);
		console.log(hashedPassword);

		db.query('INSERT INTO users SET ?', {name : name, email : email, password : hashedPassword}, (error, results) => {
			if (error) {
				console.log(error);
			}
			else {
				console.log(results);
				return res.json({
				message: 'User registered'
			});
			}
		})
	});

}