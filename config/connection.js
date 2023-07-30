var MongoClient=require('mongodb-legacy').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const url='mongodb://127.0.0.1:27017/'
    const dbname='userData'
    MongoClient.connect(url,(err,client)=>{
        if(err) return done(err)
        state.db=client.db(dbname)
        done();
    })
}
module.exports.get=function(){
    return state.db
} 