const Router = require("express").Router();
const lessonController = require("../../controller/lesson.controller");
var multer  = require('multer');
const { check, validationResult,body } = require('express-validator');
const fs=require('fs');
const path= require('path');
var verifyToken = require("../../middleware/verifyToken");


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

let validateLesson=[
  body('docs').custom((value, { req }) => {
    if(req.files['docs'] == undefined){
      throw new Error('Vui lòng chọn file văn bản');
    }else{
      for(let i=0;i<req.files['docs'].length;i++){
        var mimetype=req.files['docs'][i].originalname;
        var type=mimetype.split(".")[mimetype.split(".").length-1];
        if(type!="doc" && type!="pdf" && type!="txt" && type!="xlsx" && type!="docx"){
          for(let j=0;j<req.files['docs'].length;j++){
            fs.unlink(path.join(__dirname, '../../public/upload/lesson/')+req.files['docs'][j].filename,(err)=>{
              // console.log(err);
            });
          }
          throw new Error('Các định dạng file yêu cầu là doc, pdf, xlsx ,txt');
        }
      }
      return true;
    }
  }),
  body('videos').custom((value, { req }) => {
    if(req.files['videos'] == undefined){
      throw new Error('Vui lòng chọn tập tin video');
    }else{
      for(let i=0;i<req.files['videos'].length;i++){
        var mimetype=req.files['videos'][i].originalname;
        var type=mimetype.split(".")[mimetype.split(".").length-1];
        if(type!="mp4"){
          for(let j=0;j<req.files['videos'].length;j++){
            fs.unlink(path.join(__dirname, '../../public/upload/lesson/')+req.files['videos'][j].filename,(err)=>{
              // console.log(err);
            });
          }
          throw new Error('Định dạng video hỗ trợ là Mp4');
        }
      }
      return true;
    }
  })
];

Router.post('/create-lesson',[verifyToken,cpUpload,validateLesson],function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
  }
  let video = req.files['videos'][0].filename;
  let docs = Array();
  for(let i=0 ; i<req.files['docs'].length;i++){
    docs.push(req.files['docs'][i].filename);
  }
  lessonController.createLesson(docs,video,req.body).then(newLesson=>{
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

Router.delete('/delete-lesson-file/:idLesson/:fileName',verifyToken,function(req,res,next){
  lessonController.deleteFileOfLesson(req.params.idLesson,req.params.fileName).then(deleted=>{
    return res.status(200).send(deleted);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.delete('/delete-lesson/:idLesson',verifyToken,(req,res,next)=>{
  lessonController.deleteLesson(req.params.idLesson).then(deleted=>{
    return res.status(200).send(deleted);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.put('/update-lesson/:idLesson',verifyToken,(req,res,next)=>{
  lessonController.updateLesson(req.params.idLesson,req.body).then(newLesson=>{
    return res.status(200).send(newLesson);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});

Router.delete('/delete-a-multiple-choice/:idLesson/:idMultipleChoice',verifyToken,(req,res,next)=>{
  lessonController.deleteMultipleChoice(req.params.idLesson,req.params.idMultipleChoice).then(deleted=>{
    return res.status(200).send(deleted);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});



let validateAddAMultipleChoice=[
  body('multipleChoice').custom((value, { req }) => {
    let newValue=(value);
    console.log(newValue.length);
    if(newValue.A ==undefined || newValue.B ==undefined || newValue.C ==undefined || newValue.D ==undefined || newValue.answer ==undefined || newValue.question ==undefined ){
      throw new Error('Câu trắc nghiệm không đúng form yêu cầu gồm A, B, C, D, câu hỏi và đáp án đúng');
    }
    return true;
  })
];


Router.put('/add-an-multiple-choice/:idLesson',[verifyToken,validateAddAMultipleChoice],(req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
  }
  lessonController.addAnMultipleChoice(req.params.idLesson,(req.body.multipleChoice)).then(result=>{
    return res.status(200).send(result);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
})



let validateVideo=[
  body('videos').custom((value, { req }) => {
    if(req.file == undefined){
      throw new Error('Vui lòng chọn tập tin video');
    }else{
      var mimetype=req.file.originalname;
      var type=mimetype.split(".")[mimetype.split(".").length-1];
      if(type!="mp4"){
        fs.unlink(path.join(__dirname, '../../public/upload/lesson/')+req.file.filename,(err)=>{
          // console.log(err);
        });
        
        throw new Error('Định dạng video hỗ trợ là Mp4');
      }
      return true;
    }
  })
];

Router.put('/add-video/:idLesson',[verifyToken,upload.single('videos'),validateVideo],(req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
  }
  lessonController.addVideo(req.params.idLesson,req.file.filename).then(newLesson=>{
    res.status(200).send(newLesson);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});





let validateDoc=[
  body('docs').custom((value, { req }) => {
    if(req.file == undefined){
      throw new Error('Vui lòng chọn file văn bản');
    }else{
        var mimetype=req.file.originalname;
        var type=mimetype.split(".")[mimetype.split(".").length-1];
        if(type!="doc" && type!="pdf" && type!="txt" && type!="xlsx" && type!="docx"){
            fs.unlink(path.join(__dirname, '../../public/upload/lesson/')+req.file.filename,(err)=>{
              // console.log(err);
            });
          throw new Error('Các định dạng file yêu cầu là doc, pdf, xlsx ,txt');
        }
      return true;
    }
  }),
];

Router.put('/add-docs/:idLesson',[verifyToken,upload.single('docs'),validateDoc],(req,res,next)=>{
  // console.log(req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
  }
  lessonController.addDoc(req.params.idLesson,req.file.filename).then(newLesson=>{
    res.status(200).send(newLesson);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});


let validateListMultipleChoice=[
  body('multipleChoices').custom((newValue, { req }) => {
    console.log(req.body.multipleChoices);
    console.log(newValue.length);
    for(let i=0;i<newValue.length;i++){
      if(newValue[i].A ==undefined || newValue[i].B ==undefined || newValue[i].C ==undefined || newValue[i].D ==undefined || newValue[i].answer ==undefined|| newValue[i].question ==undefined){
        throw new Error('Câu trắc nghiệm không đúng form yêu cầu gồm A, B, C, D và đáp án đúng');
      }
    }
    return true;
  }),
];


Router.put('/add-list-multiple-choice/:idLesson',[verifyToken,validateListMultipleChoice],(req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
  }

  lessonController.addListMultipleChoice(req.params.idLesson,req.body.multipleChoices).then(result=>{
    return res.status(200).send(result);
  }).catch(err=>{
    console.log(err);
    return res.status(500).send({"message":"Lỗi server"});
  })
});


Router.get('/get-lesson-by-id/:idLesson',verifyToken,function (req, res, next) {
  lessonController.getLessonById(req.params.idLesson).then(lesson=>{
    res.status(200).send(lesson);
  }).catch(err=>{
    console.log(err);
    res.status(500).send({"message":"Lỗi server"});
  });
});

Router.get('/stream-video/:video',verifyToken,(req,res,next)=>{
  console.log("start stream...........");
  let pathStoreVideo="../../public/upload/lesson/"+req.params.video;
  const pathFile = path.join(__dirname, pathStoreVideo);
  const stat = fs.statSync(pathFile)
  const fileSize = stat.size
  const range = req.headers.range
  let downloaded=0;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    console.log(chunksize);
    const file = fs.createReadStream(pathFile, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.on('data',(chunk)=>{
      downloaded += chunk.length;
      console.log(downloaded);
    });
    file.on('open',(chunk)=>{
      file.pipe(res);
    });
    
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(pathFile).pipe(res)
  }
});


module.exports = Router;
