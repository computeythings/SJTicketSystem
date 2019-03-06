require('dotenv').config();
var public,private;
if (process.env.NODE_ENV === 'production') {
  public = fs.readFileSync(process.env.SERVER_CERT);
  private = fs.readFileSync(process.env.SERVER_KEY);
} else {
  public = private = process.env.TEST_SECRET;
}

module.exports = { private: private, public: public };
