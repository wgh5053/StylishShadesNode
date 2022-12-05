var express = require('express');
     path = require('path');
     app = express();
     mongoose = require('mongoose');
     User = require('./Model/User');
     jwt = require('jsonwebtoken');
     secret = 'asjkldnauksbndjkabnfsjkb';
     bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'/views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect('mongodb+srv://admin:Swimming24@stylishshades.5kmxdvs.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Connected to DB'))
    .catch(err=>console.error('Something went wrong', err));



app.get('/', function(req,res){
    res.render("Home")
});
app.get('/home', function(req,res){
    res.render("Home")
});
app.get('/login', function (req, res){
    res.render("Login")
});
app.post("/api/login", async (req, response)=>{
    const username = req.body.username;
    const passw = req.body.password;
    user = await User.findOne({ username}).lean()
    if(!user){
        return response.json({value: 'error', error: 'User not found'})
    }
    if(user.password === passw){
        console.log(user)
        const token = jwt.sign({
                id: user._id,
                user: user.username,
                name: user.name,
                dob: user.dob
            }, secret
        )

        return response.json({value: 'ok', data: token})
    }
})
app.get('/signup', function (req,res){
    res.render("SignUp")
});
app.post('/api/register', async (req,response)=>{
    const { username, password, name, dob } = req.body
    if(!username || typeof username != "string"){
        return response.json({ value: 'error', error: 'invalid username'})
    }

    if(!password || typeof password != 'string'){
        return response.json({ value: 'error', error: 'invalid password'})
    }

    try{
        const info = await User.create({
            username,
            password,
            name,
            dob
        })
        console.log('User created successfully', info)
    } catch (error) {
        if(error.code === 11000){
            return response.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }
    response.json({value: 'ok'})
})
app.get('/cart', function (req, res){
    res.render('Cart')
});
app.get('/men', function (req, res){
    res.render('Men')
});
app.get('/women', function (req, res){
    res.render('Women')
});


const getUser = async(req, res)=>{
    try{res.send(await user)}
    catch(e) {
        console.log(e);
    }
}
app.get('/getUser', getUser);
app.listen(process.env.port || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));