var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers')

/* GET home page. */

router.get('/', function (req, res, next) {
  if (req.session.isTrue){
    let mail=req.session.data.email
    let name=req.session.data.first_name
    res.render('home', { mail,name,style: 'stylehome.css', admin: false,user:true,url:'/images/bgimghome.webp' })
  }
  else if(req.session.isadmin){
    res.redirect('/admin')
  }
  else{
      let userLoginError=req.session.userError
      res.render('login', {userLoginError, style: "style1.css", url: 'images/bgImage.webp',goto:'/login' });
      req.session.userError=false;
    }
    
});
router.get('/index', (req, res) => {
  if (req.session.isTrue||req.session.isadmin)
    res.redirect('/')
  else
    res.render('index', { admin: false, goto:'/submit',heading:"REGISTRATION FORM",style:'style.css'})
})

router.post('/login', (req, res) => {
  userHelpers.getOne(req.body).then((response)=>{
    req.session.data=response
  })
  userHelpers.doLogin(req.body).then((response)=>{
    req.session.isTrue=true;
    res.redirect('/')
  }).catch(()=>{
    req.session.userError=true;
    res.redirect('/')
  })
})
router.get('/login', (req, res) => {
  if (req.session.isTrue||req.session.isadmin)
    res.redirect('/')
  else
    res.render('login', { style: "style1.css", url: 'images/bgImage.webp',goto:'/login' });
})
router.post('/submit', (req, res) => {
  userHelpers.doSignup(req.body).then((response)=>{
    userHelpers.getOne(req.body).then((response)=>{
      req.session.isTrue = true;
      req.session.data=response
      res.redirect('/')
    })
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
