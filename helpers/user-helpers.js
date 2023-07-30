var db=require('../config/connection')
var collections=require('../config/collections')
var bcrypt=require('bcrypt')
module.exports={
    // addUser:(user,callback)=>{
    //     db.get().collection(collections.USERS_COLLECTION).insertOne(user).then((data)=>{
    //         callback(true)
    //     })
    // },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collections.USERS_COLLECTION).find({"is_admin":"false"}).toArray()
            resolve(users)
        })
    },
    doSignup:(userEntry)=>{
        return new Promise(async(resolve,reject)=>{
            userEntry.pw= await bcrypt.hash(userEntry.pw,10)
            userEntry.pw_confirm=await bcrypt.hash(userEntry.pw_confirm,10)
            db.get().collection(collections.USERS_COLLECTION).insertOne(userEntry).then((data)=>{
                resolve(data)
            })
        })
    },
    doLogin:(userEntry)=>{
        return new Promise (async(resolve,reject)=>{
            let user=await db.get().collection(collections.USERS_COLLECTION).findOne({$and:[{email:userEntry.email},{is_admin:"false"}]})
            if(user){
                bcrypt.compare(userEntry.password,user.pw).then((status)=>{
                    if (status){
                        console.log('login success');
                        resolve(status)
                    }
                    else{
                        console.log('login failed');
                        reject();
                    }
                })
            }
            else {
                reject()
                console.log('login failed here');}
        })
    },
    getOne:(userEntry)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collections.USERS_COLLECTION).findOne({email:userEntry.email})
            if(user)
                resolve(user);
        })
    }
   
}