var db=require('../config/connection')
var collections=require('../config/collections')
var bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')
var objectId=require('mongodb-legacy').ObjectId

module.exports={
    doAdminLogin:(userEntry)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collections.USERS_COLLECTION).findOne({is_admin:'true'})
            if(user){
                bcrypt.compare(userEntry.password,user.pw).then((status)=>{
                    if(status)
                        resolve(status) 
                    else
                        reject()

                })
            }
            else{
                reject()
            }
        })
    },
    doDelete:(userEntry)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USERS_COLLECTION).deleteMany({_id:new objectId(userEntry)}).then((result)=>{
                resolve(result)
            })
                
        })
    },
    getUser:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userDetails= await db.get().collection(collections.USERS_COLLECTION).findOne({_id:new objectId(userId)}).then((result)=>{
                
                resolve(result)
                //console.log(userDetails);
            })
        })
    },
    updateUser:(userId,userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let userUpdate=await db.get().collection(collections.USERS_COLLECTION).updateOne({_id:new objectId(userId)},{
                $set:{
                    first_name:userDetails.first_name,
                    last_name:userDetails.last_name,
                    email:userDetails.email,
                    gender:userDetails.gender
                }
            }).then((response)=>{
                resolve(response)
            })
        })

    },
    searchUser:(entry)=>{
        return new Promise(async(resolve,reject)=>{
            let userEntry=await db.get().collection(collections.USERS_COLLECTION).find({first_name:entry}).toArray()
            if(userEntry[0])
                resolve(userEntry)
            else reject("No data found")
        })
    }
}