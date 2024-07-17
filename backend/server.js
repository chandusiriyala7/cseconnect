const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp')
const {executePy} = require('./executePy')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded(({extended:true})));

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password : '',
    database :'signup',
})

// Signup API
app.post('/signup' , (req,res) => {
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    db.query(sql, [values], (err , data) =>{
        if(err) {
            return res.json("Error");
        }
        return res.json(data);
    })

    
})


// Login API
app.post('/login' , (req,res) => {
    const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email,req.body.password], (err , data) =>{
        if(err) {
            return res.json("Error");
        }
        
        if(data.length > 0){
            return res.json("Success");
        }else{
            return res.json("Fail");
        }
    })

    
})


// Code Compiler API
app.post('/run' , async (req,res) => {
    const {language  ,code} = req.body;
    console.log(language,code.length);
    if(code === undefined){
        return res.status(400).json({success : false , error : "Empty code body!" });
    }

    try {

       
    const filepath = await generateFile(language , code);

    let output;

    if(language === "cpp"){
         output = await executeCpp(filepath);
    } else{ 
        output  = await executePy(filepath);
    }

   
    return res.json({filepath, output});}
    catch(err){
        res.status(500).json({err});
    }
});

//Add Blogs API

app.post("/addblogs" ,(req,res) => {
    const sql = "INSERT INTO blogs (`id`,`username`,`date`,`description`) VALUES (?)";
    const blogDetails = [
        req.body.id,
        req.body.username,
        req.body.date,
        req.body.description,
    ]
    db.query(sql , [blogDetails] , (err,data) =>{
        if(err){
            console.log("Error")
            return res.json(err);;
        }
        return res.json(data);
    })
})

//GET Blogs API

app.get("/blogs" ,(req,res) => {
    const sql =  "SELECT * FROM blogs";
    db.query(sql, (err,data) =>{
        if(err){
            console.log("Error")
        }
        return res.json(data)
    })
})

//DELETE Blogs API

app.delete("/deleteblog" , (req,res) =>{
    const sql = "DELETE FROM blogs WHERE `id` = ?;";
    const blogId = req.body.blogId;
  
    db.query(sql,[blogId.id], (err,data) =>{

        if(err){
            console.log("Error");
        }
        return res.json({message : "Suucessfully deleted",data});
    })
})


// GET Problems API 

app.get("/problems", (req , res) => {
    const sql = "SELECT * FROM problems";

    db.query(sql,(err,data) =>{
        if(err){
            console.log("Error");
        }
        return res.json(data);
    });
});

// GET Problem API 

app.get("/problems/:id" , (req,res) =>{
    const sql = "SELECT * FROM problems WHERE `id` = ?";
    const id  = req.params.id;

    db.query(sql, [id] , (err,data) =>{
        if(err){
            console.log("Error");
        }
        return  res.json(data);
    })
})

// GET Quiz Data 

app.get('/quiz', (req,res) =>{
    const sql = "SELECT * FROM quiz WHERE `topic` = ?";
    const topic = req.query.topic;

    db.query(sql,[topic],(err,data) =>{
        if(err){ 
            console.log("Error")
        }
        return res.json(data);
    })
})


 


app.listen(8081, () => {
    console.log("listening");
})