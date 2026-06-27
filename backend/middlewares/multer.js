import multer from "multer";

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{

        if(file.fieldname === "notes"){
            cb(null,"./public/notes")
        }else{
            cb(null,"./public")
        }

    },
    filename:(req,file,cb)=>{
        cb(null,Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage})

export default upload




// // middleware/upload.js
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/videos");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// module.exports = multer({ storage });