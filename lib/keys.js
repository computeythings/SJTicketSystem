require('dotenv').config();
var public,private,algorithm;
if (process.env.NODE_ENV === 'production') {
  public = fs.readFileSync(process.env.SERVER_CERT);
  private = fs.readFileSync(process.env.SERVER_KEY);
  algorithm = 'RS256';
} else {
  public = private = process.env.TEST_SECRET;
  algorithm = 'HS256';
}

module.exports = { private: private, public: public, algorithm: algorithm };
