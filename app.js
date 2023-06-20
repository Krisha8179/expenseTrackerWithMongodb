const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');


const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature');
const forgotPasswordRoutes = require('./routes/forgotPassword');


const cors = require('cors');
const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order');
const ForgotPassword = require('./models/ForgotPassword');
 

const app = express();
app.use(bodyParser.json({extended: false}));



app.use(cors());


app.use(userRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeatureRoutes);
app.use(forgotPasswordRoutes)

app.use((req, res) => {
    console.log('url is:', req.url);
    res.sendFile(path.join(__dirname, `frontend/${req.url}`));
})

mongoose.connect('mongodb://0.0.0.0:27017/expense_tracker')
.then(result => {
    console.log('connected')
    app.listen(3000);
}).catch( err => {
  console.log(err);
})