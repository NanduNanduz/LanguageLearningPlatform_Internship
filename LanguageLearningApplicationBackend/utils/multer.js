import multer from "multer";
import fs from "fs";
import path from "path";



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

// Utility function to delete files after upload
export const deleteLocalFiles = (files) => {
  files.forEach((file) => {
    const filePath = path.join(uploadDir, file.filename);
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Error deleting file: ${filePath}`, err);
      else console.log(`Deleted file: ${filePath}`);
    });
  });
};

export const deleteLocalFilez = (files) => {
  if (!files || !Array.isArray(files)) return;
  
  files.forEach((file) => {
    if (file?.path) {
      const filePath = path.resolve(file.path);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        } else {
          console.log(`Deleted local file: ${filePath}`);
        }
      });
    }
  });
};
