const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    weeks: {
        type: String,
        required: [true, 'Please add a duration']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add minimum requirement skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    }
},
);

courseSchema.statics.getAverageCost = async function (bootcampId){
   const avg =  await this.aggregate([
        {$match:{bootcamp:bootcampId}},
        {$group:{_id:'$bootcamp',averageCost:{$avg:'$tuition'}}}
    ]);
    
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageCost: Math.ceil(avg[0].averageCost/10)*10
        });    
    } catch (error) {
        console.log(error);
    }
}

courseSchema.pre('save',async function(){
    this.constructor.getAverageCost(this.bootcamp);
});

courseSchema.post('remove',async function(){
    this.constructor.getAverageCost(this.bootcamp);
});

const course = mongoose.model('Course', courseSchema);

module.exports = course;