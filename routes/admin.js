var express = require('express');
var router = express.Router();
var adminHelpers = require('../helpers/user-helpers')
var adminHelpersOwn=require('../helpers/admin-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) { 
  let searchFailed=req.session.userSearch
  if(req.session.isadmin===true){
    let adminName=req.session.adminData.first_name
    adminHelpers.getAllUsers().then((users) => {
      res.render('admin/adminpage', {searchFailed,adminName, users,admin:true,url:'images/bgadmin.webp',style:'styleAdmin.css'})
      req.session.userSearch=false
    })
  }
  else if(req.session.isTrue)
    res.redirect('/')
  else{
    res.redirect('/admin/to_admin_login'); 
  }
});
router.get('/adduserFromHead', (req, res) => {
  if(req.session.isadmin)
    res.render('index', {heading:"REGISTRATION FORM", style: "style.css", admin: false, goto: '/admin/adduser' })
  else
    res.redirect('/admin')
})
router.post('/adduser', (req, res) => {
  // req.session.isadmin=true;
  adminHelpers.doSignup(req.body).then((response)=>{
    // req.session.adminCreated=true;
    
    // res.render('admin/adminpage', {admin:true,url:'images/bgadmin.webp',style:'styleAdmin.css'})
    res.redirect('/admin')
  })
  // res.redirect('/admin')
})
router.get('/adminSignup',(req,res)=>{
  if(req.session.isadmin)
    res.redirect('/admin')
  else{
    let adminSignup=true;
  res.render('index',{heading:"REGISTRATION FORM",adminSignup,goto:'/admin/letadmin',style:'style.css'})
  }
})
router.get('/to_admin_login',(req,res)=>{
  if(req.session.isadmin)
    res.redirect('/admin')
  else{
    let adminlogin=true;
    let adminLoginError=req.session.adminError
  res.render('login', {adminLoginError, style: "adminlog.css", url: '/images/bgadmin.webp' ,adminlogin,goto:'/admin/goto_admin'});
  }
})
router.post('/letadmin',(req,res)=>{
  adminHelpers.doSignup(req.body).then((response)=>{
      res.redirect('/admin')
  })

})
router.post('/goto_admin',(req,res)=>{
  adminHelpersOwn.doAdminLogin(req.body).then((response)=>{
    adminHelpers.getOne(req.body).then((result)=>{
      req.session.adminData=result
      req.session.isadmin=true
      res.redirect('/admin')
    })   
  }).catch(()=>{
    req.session.adminError=true;
    res.redirect('/admin')
  })
})
router.get('/deleteUser/:id',(req,res)=>{
  let userId=req.params.id
  adminHelpersOwn.doDelete(userId).then((result)=>{
    res.redirect('/admin')
  })
})

router.get('/editUser/:id',async(req,res)=>{
  let userId=req.params.id
  let userEditableData=await adminHelpersOwn.getUser(userId).then((UserData)=>{
    res.render('admin/edituser',{UserData, heading:"EDIT USERS",style:'style.css'})
  })
})

router.post('/edit_user/:id',(req,res)=>{
  
  let userId=req.params.id
  adminHelpersOwn.updateUser(userId,req.body).then((result)=>{
    res.redirect('/admin')
  })
})
router.get('/adminLogout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
})

router.post('/searchUser',async(req,res)=>{
  
  let entry=req.body.user_search
  let adminName=req.session.adminData.first_name
  let userDone=await adminHelpersOwn.searchUser(entry).then((users)=>{
    res.render('admin/adminpage', {adminName,users,admin:true,url:'images/bgadmin.webp',style:'styleAdmin.css'})
    console.log(users);
  }).catch(()=>{
    console.log("No such entry");
    req.session.userSearch=true
    res.redirect('/')
  })
  
  
})

module.exports = router;
