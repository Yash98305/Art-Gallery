const express = require("express");
const app = express();
const dotenv = require('dotenv');
const errorMiddleware = require("./middlewares/error.js")
const userRoute = require('./routes/userRoute.js')
const cartRoute = require('./routes/cartRoute.js')
const productRoute = require('./routes/productRoute.js')
const teamRoute = require('./routes/teamRoute.js')
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const cors = require('cors')
const {fileURLToPath} = require("url");
const contactRoute = require("./routes/contactRoute.js")
dotenv.config()

const corsOptions = {
    origin: "https://art-gallery-website-by-yash-patel.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())
app.use('/', express.static('dist'))
app.use(morgan("dev"))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/user',userRoute);
app.use('/api/v1/product',productRoute);
app.use('/api/v1/team',teamRoute);
app.use('/api/v1/cart',cartRoute);
app.use('/api/v1',contactRoute);

app.get('/',(req,res)=>{
    res.send({
        message:"welcome to Art Gallery"
    })
})    

app.use(errorMiddleware);

module.exports = app;
