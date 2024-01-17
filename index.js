// import packages
const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

// load the env variables
require('dotenv').config();
// table name
const TABLE_NAME = "test-crud"

// import dynamodb methods
const {
    getAllItems,
    getSingleItemById,
    updateItem,
    insertItem,
    deleteSingleItemById
} = require('./dynamo');

// setup express app
const app = express();

// setup middlewares
app.use(express.json());
app.use(morgan('dev'));

// setup endpoints
// app.get('/', (req, res) =>{
//     res.send('hello from express and dynamodb app')
// })

app.post('/items', async (req, res) => {
    const body = req.body;
    try {
        body.id = uuidv4();
        const newItem = await insertItem(TABLE_NAME, body)
        console.log('newItem', newItem)
        res.status(201).json({
            message: 'new item created successfully',
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})

app.get('/items', async (req, res) => {
    try {
        const items = await getAllItems(TABLE_NAME);
        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


app.get('/items/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const items = await getSingleItemById(TABLE_NAME, id);
        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


app.put('/items/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
        
        const item = await updateItem(TABLE_NAME, id, body)        
        res.status(201).json({
            message: 'item updated successfully',
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


app.delete('/items/:id', async (req, res) => {   
    const id = req.params.id;
    try {
        const item = await deleteSingleItemById(TABLE_NAME, id)        
        res.status(201).json({
            message: 'item deleted successfully',
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        })
    }
})


// setup server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})