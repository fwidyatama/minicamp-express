const mongoose = require ('mongoose');

const reviewSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please provide title']
    },
    text:{
        type:String,
        required:[true,'Please provide review']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'Please provide rating score']
    },
   bootcamp:{
       type:mongoose.Schema.ObjectId,
       ref:'Bootcamp',
       required:true,
   },
   user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:true,
}
});

reviewSchema.statics.getAverageRating = async function (bootcampId){
    const avg =  await this.aggregate([
         {$match:{bootcamp:bootcampId}},
         {$group:{_id:'$bootcamp',averageRating:{$avg:'$rating'}}}
     ]);
     
     try {
         await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRating: avg[0].averageRating
         });    
     } catch (error) {
         console.log(error);
     }
 }
 
 reviewSchema.pre('save',async function(){
     this.constructor.getAverageRating(this.bootcamp);
 });
 
 reviewSchema.post('remove',async function(){
     this.constructor.getAverageRating(this.bootcamp);
 });

const review = mongoose.model('Review',reviewSchema);

module.exports = review;