docker build -t export-mlabs .

docker run -t -i -e MongoDb='mongodb://intuitiv:decabeca11@ds161285.mlab.com:61285/intuitiv' --name labs-run export-mlabs
