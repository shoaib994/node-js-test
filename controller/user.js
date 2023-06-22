const XLSX = require('xlsx');
// const fileData=require('./medical.xlsx')
const path = require('path');
const fs=require('fs');
const {google}=require('googleapis')
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");

exports.getCity= async (req, res, next) => {
  try {
  
    function readJSONFile(filePath) {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    }
    const filePath = path.join(__dirname, 'city.json');
 // Set the appropriate CORS headers
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET');
 res.setHeader('Access-Control-Allow-Headers', '');

    readJSONFile(filePath)
      .then((jsonData) => {
        
      return res.json({
        city:jsonData
      })
        // Return the jsonData as a response or perform further operations
      })
  }
  catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}
exports.getMedical= async (req, res, next) => {
  try {
  
    function readJSONFile(filePath) {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    }
    const filePath = path.join(__dirname, 'medical.json');
 // Set the appropriate CORS headers
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET');
 res.setHeader('Access-Control-Allow-Headers', '');

    readJSONFile(filePath)
      .then((jsonData) => {
        
      return res.json({
        city:jsonData
      })
        // Return the jsonData as a response or perform further operations
      })
  }
  catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}
exports.generateFile= async (req, res, next) => {
  try {
       
    const {name,email,city,phone,CPT_code,procedureName,procedureType,zip_code}=req.body;
    console.log(req.body)
  // Load the docx file as binary content
  const cptCode=procedureType
  var filename=''
  if(procedureType?.toLowerCase()=="labs"){
    filename='labs'
  }
  else if(procedureType=='Imaging and Radiology'){
    
    filename='radiology'
  }
  else{
    filename='specialist'
  }
  const content = fs.readFileSync(
    path.join(__dirname, `../template/${filename}.docx`),
    "binary"
);

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
  });

  // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
  doc.render({
      procedure_name: procedureName,
      CPT_code: CPT_code,
      zip_code: zip_code,
      name: name,
      email:email
  });
  const fileName=`${name}_${cptCode}_${Date.now()}`
  const buf = doc.getZip().generate({
      type: "nodebuffer",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
  });

  // buf is a nodejs Buffer, you can either write it to a
  // file or res.send it with express for example.
  fs.writeFileSync(path.join(__dirname, `../files/${fileName}.docx`), buf);



    // read
    const google_api_folder="1vBDgMPWAWpV1N5lXo_mFli4pcq6VWCtB"
    // const JSONFilePath=`${__dirname}/me.jpg`
    const JSONFilePath = path.join(__dirname, 'google_drive_json.json');
   
    const auth= new google.auth.GoogleAuth({
      keyFile:JSONFilePath,
      scopes: ['https://www.googleapis.com/auth/drive']
    })

    const driveServices=google.drive({
      version:'v3',
      auth
    })
    const fileMetaData={
      'name':fileName,
      parents:[google_api_folder]
    }
    const file = path.join(__dirname, `../files/${fileName}.docx`);

    const mediaService={
      mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      body: fs.createReadStream(file)
    }

    const response=await driveServices.files.create({
      resource:fileMetaData,
      media:mediaService,
      field:'id'
    })

    // return res.json({
    //   data:response.data.id
    // })

    // Delete files from folder

    const folderPath = path.join(__dirname, `../files`);
    // const folderPath = 'path_to_folder';
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }
    
      // Iterate over the files in the folder
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
    
        // Delete each file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }
    
          console.log('File deleted successfully:', filePath);
        });
      });
    });
    // 


 // Set the appropriate CORS headers
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Methods', 'GET');
 res.setHeader('Access-Control-Allow-Headers', '');

      
      return res.json({
        data:response.data.id
      })

  }
  catch (error) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

// exports.createFile= async (req, res, next) => {
//   try {
  
    
//   // Load the docx file as binary content
//   const content = fs.readFileSync(
//     path.resolve(__dirname, "../template/labs.docx"),
//     "binary"
// );

// const zip = new PizZip(content);

// const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
// });

// // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
// doc.render({
//     procedure_name: "abc",
//     CPT_code: "1234",
//     zip_code: "50800",
//     name: "Shoaib",
//     email:"Ahmad"
// });
//  const email=`shoaib_${Date.now()}`
// const buf = doc.getZip().generate({
//     type: "nodebuffer",
//     // compression: DEFLATE adds a compression step.
//     // For a 50MB output document, expect 500ms additional CPU time
//     compression: "DEFLATE",
// });

// // buf is a nodejs Buffer, you can either write it to a
// // file or res.send it with express for example.
// fs.writeFileSync(path.resolve(__dirname, `../files/${email}.docx`), buf);
//  // Set the appropriate CORS headers
//  res.setHeader('Access-Control-Allow-Origin', '*');
//  res.setHeader('Access-Control-Allow-Methods', 'GET');
//  res.setHeader('Access-Control-Allow-Headers', '');


//       return res.json({
//         city:"abc"
//       })
//         // Return the jsonData as a response or perform further operations
     
//   }
//   catch (error) {
//     return res.json({
//       success: false,
//       message: error.message
//     })
//   }
// }