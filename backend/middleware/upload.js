const multer = require('multer');

//store file temporary

const storage  = multer.memoryStorage();
const upload  = multer({storage})

module.exports = upload;