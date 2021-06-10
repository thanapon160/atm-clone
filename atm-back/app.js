require('dotenv').config();
const express = require('express')
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const userController = require('./controllers/userController')
const transactionRoute = require('./routes/transactionRoute')
const { sequelize } = require('./models');

//set up express
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/users', userRoute)
app.use('/transaction', transactionRoute)

//middlewares
app.use((req, res, next) => {
  res.status(400).json({ message: "path not found on this server" })
})

// sequelize.sync({ force: true }).then(() => console.log('DB sync'))

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on port ${port}`));