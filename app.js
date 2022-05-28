const express = require('express')
const app = express()
app.set('view engine', 'ejs');
app.use(express.static('assets'))
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render("mario")
})
app.listen(process.env.PORT||3000,process.env.IP,()=>{
    console.log("Launching Server")
})