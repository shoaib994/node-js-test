const express = require('express');

const router = express.Router();

const { getCity, getMedical,generateFile} = require('../controller/user');

// const aws=require('aws-sdk')
// const multer=require('multer')
// const multers3=require('multer-s3')

// aws.config.update({
//     secretAccessKey: '6UdT1GVNFDQqZ4/zfs9aN0OOP7ipZDe/xk8Kw4KA',
//     accessKeyId: 'AKIAXHDYJZWXYBA63MBY',
//     region: 'us-east-2',

// })

// const bucket='publicgoogledrive';
// const s3=new aws.S3()

// var upload= multer({
//     storage:multers3({
//         bucket:bucket,
//         s3:s3,
//         acl:"public-read",
//         key:(req,file,cb)=>{
//             cb(null,file.originalname)
//         }
//     })
// })

router.get('/get_city', getCity);
router.get('/get_medical', getMedical);
router.post('/create_file', generateFile);
// router.post('/data', generateData);
// router.post('/create_file',upload.single('file'), generateFile);
// router.post('/file', createFile);


module.exports = router;