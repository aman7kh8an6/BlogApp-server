import express from 'express';
import mysql from 'mysql';
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json())
const PORT = 5000;
const BASE_URL = process.env.BASE_URL

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Aman@1998"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.post('/register',(req,res)=>{
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var sql = "insert into blog.users (username, email, password) values ?"
    var values = [ [username, email, password] ];
    
    con.query(sql, [values], (err,result)=>{
        if (err) throw err; 
        console.log("Number of records inserted: " + result.affectedRows); 
    });
});

app.post('/login', (req,res) =>{
    var username = req.body.username;
    var password = req.body.password;
    var sql = "select * from blog.users where username = ?"
    var value = username;
    con.query(sql,[value],(err,result)=>{
        if(err) throw err;
        if(result.length == 0){
            res.send("User is not Registered");
            console.log("User not Registered!");
        }else{
            res.send(result);
        }
    })
})

app.get('/',(req,res) =>{
    var sql = "select * from blog.users";
    con.query(sql, (err,result)=>{
        if (err) throw err;  
        res.send(result)
    });
})


// // Post

app.post('/write', (req,res) =>{
    const post_detail = req.body.createPost;
    var sql = "insert into blog.posts (user_id, title, content, category, images, dt_added ) values ?"
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let mnth = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let finalDate = date + '-' + mnth + '-' + year;
    var values = [ [post_detail.user_id, post_detail.title, post_detail.content, post_detail.category, post_detail.file, finalDate ] ];
    
    con.query(sql, [values], (err,result)=>{
        if (err) throw err; 
        res.send(result);
    })
});

// fetch categories
app.get('/tags',(req,res) =>{
    var sql = 'select distinct category from blog.posts;'
    con.query(sql,(err,result) =>{
        if(err) throw err;
        res.send(result);
    })
})



// //Fetch all the post
app.get('/fetchPosts',(req,res) =>{
    var sql = 'select p.post_id, p.title, p.content, p.category, p.images, p.dt_added,u.user_id, u.username, u.user_img from blog.posts as p inner join blog.users as u on p.user_id = u.user_id;'

    con.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

//Fetch Single Post
app.get('/:id',(req,res) =>{
    var sql = 'select p.post_id, p.title, p.content, p.category, p.images, p.dt_added,u.user_id, u.username,u.user_img from blog.posts as p inner join blog.users as u on p.user_id = u.user_id where p.post_id = ?'
    con.query(sql, [[req.params.id]], (err, data) => {
        if (err) throw err;
        res.send(data);
    });
})

//Fetch Posts with particular category

app.get('/tags/:cat',(req,res) =>{
    var sql = 'select p.post_id, p.title, p.content, p.category, p.images, p.dt_added,u.user_id, u.username, u.user_img from blog.posts as p inner join blog.users as u on p.user_id = u.user_id where p.category = ?;'
    console.log('tag',req.params.cat);
    con.query(sql, [[req.params.cat]], (err,data) =>{
        if(err) throw err;
        res.send(data);
    })
})

app.listen(BASE_URL || PORT, ()=>{
    console.log("Hi");
})
