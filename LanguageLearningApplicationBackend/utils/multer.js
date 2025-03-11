import multer from "multer";



const storage = multer.diskStorage({
  filename:function(req,file,callback){
    callback(null,file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") || 
    file.mimetype.startsWith("video/") || 
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, videos, and PDFs are allowed."), false);
  }
};

// Multer Upload Config
export const upload = multer({ storage, fileFilter });



