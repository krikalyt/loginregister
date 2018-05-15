const  express = require('express');
const mongoose = require('mongoose');
const md5 = require('md5');
const app = express();
const hbs = require('hbs');
mongoose.connect("").then(res=>{console.log('connected to db successfully')})
.catch(error=>{
  console.log('got an error', error.message);
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'hbs');

let schema = new mongoose.Schema({
  Email: {
    type : String,
    required: true,
    unique: true
  }, 
 Password:  {
  type : String,
  required: true
 }
})
let model = mongoose.model('regusers', schema);

app.post('/user/registration' , (req,res)=>{
let Emailform = req.body.email;
let Passwordform = null;
if(req.body.password == req.body.ConfirmPassword){
   Passwordform = req.body.password ;
  console.log('password matched');
}else 
{
   return  res.render('error.hbs');
}
let user = new model({ 

  Email : Emailform,
  Password :md5(Passwordform)

})
 user.save().then(result=>{
     res.render('index.hbs' , {
       Email: Emailform
     })
 }).catch(err => {
       res.render('error.hbs')
 })
});

app.post('/user/login', (req,res)=>{
 let Emailform =   req.body.email;
 let Passwordform =   req.body.password;
 Passwordform = md5(Passwordform);
model.findOne({Email: Emailform , Password: Passwordform}).then(result=>{
       if(result.Email == null ){
         res.render('loginfail.hbs');
       }
       else if(result.Email == Emailform)
       {
         res.render('logged.hbs', {
           Email: result.Email
         })
       }
}).catch(error=>{
    res.status(400).render('loginfail.hbs');
})
})

app.listen(3000, ()=>{
  console.log("listening on port no3000");
})
