const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');

const app = express();

const login_controller = require('./controller/login_controller');
const g_controller = require('./controller/g_controller');

app.use(express.static(`${__dirname}/public`));



app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(cookie());
app.use(session({ 
	secret: 'MADE WITH LOVE',
	cookie: { maxAge: 9999999},
	resave:false,
	saveUninitialized: true,
}));


app.use(function(req, res, next) {
	if (req.url === '/login' || req.url === '/register') {
		next();
		return;
	}
	req.session.isloggedin ? next() : res.redirect('/login');
});


// 登录页
app.get('/login', login_controller.render_view);

// do登录
app.post('/login', login_controller.doLogin);

app.post('/register', login_controller.register);

app.get('/', g_controller.render_view);

app.get('/retrieve_posts_data', g_controller.retrieve_posts_data);

app.post('/upload', g_controller.add_posts_data);

app.listen(process.env.PORT || 3000);