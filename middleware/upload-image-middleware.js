const multer = require("multer")
const ApiError = require("../utils/ApiError")

const multerOptions = () => {
   const multerStorage = multer.memoryStorage()

   const multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
         cb(null, true)
      } else {
         cb(new ApiError('Only Image Allowed', 400), false)
      }
   }

   return multer({ storage: multerStorage, fileFilter: multerFilter })
}


exports.uploadSingleImage = (fieldName) => {
   const upload = multerOptions()
   return upload.single(fieldName)
}


exports.uploadMixOfImages = (arrayOfFields) => {
   const upload = multerOptions()
   return upload.fields(arrayOfFields)
}