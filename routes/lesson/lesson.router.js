const Router = require("express").Router();
const lessonController = require("../../controller/lesson.controller");
var multer  = require('multer');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/lesson')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix+'-'+file.originalname )
  }
})

var upload = multer({ storage: storage });


var cpUpload = upload.fields([{ name: 'videos', maxCount: 1 }, { name: 'docs', maxCount: 5 }])

Router.post('/create-lesson',cpUpload,function (req, res, next) {
  let multipleChoices = JSON.parse(req.body.multipleChoices);
  let video = req.files['videos'][0].filename;
  let docs = Array();
  for(let i=0 ; i<req.files['docs'].length;i++){
    docs.push(req.files['docs'][i].filename);
  }
  lessonController.createLesson(multipleChoices,docs,video,req.body).then(newLesson=>{
    res.status(200).send(newLesson);
  }).catch(err=>{
    console.log(err);
    res.status(500).send({"message":"Lỗi server"});
  });
});


Router.get('/get-lesson-by-id-course/:idCourse', function (req, res, next) {
  lessonController.getLessonByCourseId(req.params.idCourse).then(lessons=>{
    res.status(200).send(lessons);
  }).catch(err=>{
    console.log(err);
    res.status(500).send({"message":"Lỗi server"});
  });
});

Router.delete('/delete-lesson-file/:fileName',function(req,res,next){
  lessonController.deleteFileOfLesson(req.params.fileName).then(deleted=>{
    return res.status(200).send(deleted);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.delete('/delete-lesson/:idLesson',(req,res,next)=>{
  lessonController.deleteLesson(req.params.idLesson).then(deleted=>{
    return res.status(200).send(deleted);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.put('/update-lesson/:idLesson',(req,res,next)=>{
  lessonController.updateLesson(req.params.idLesson,req.body).then(newLesson=>{
    return res.status(200).send(newLesson);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.delete('/delete-a-multiple-choice/:idLesson/:idMultipleChoice',(req,res,next)=>{
  lessonController.deleteMultipleChoice(req.params.idLesson,req.params.idMultipleChoice).then(deleted=>{
    return res.status(200).send(deleted);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.post('/add-an-multiple-choice',(req,res,next)=>{
  lessonController.addAnMultipleChoice(req.body.idLesson,(req.body.multipleChoice)).then(result=>{
    return res.status(200).send(result);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
})


module.exports = Router;
