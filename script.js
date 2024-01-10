const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb://localhost/moneytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String
});
const Transaction = mongoose.model('Transaction', transactionSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.post('/addTransaction', (req, res) => {
    const { description, amount, type } = req.body;
    const newTransaction = new Transaction({
        description,
        amount,
        type
    });
    newTransaction.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving transaction');
        } else {
            res.redirect('/');
        }
    });
});
app.get('/getTransactions', (req, res) => {
    Transaction.find({}, (err, transactions) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving transactions');
        } else {
            res.json(transactions);
        }
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
