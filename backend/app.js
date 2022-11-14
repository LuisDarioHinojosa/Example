const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const port = process.env.PORT || 80;

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// connectar sql

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});


connection.connect(err =>
  {
    if(err) throw err;
    console.log(`connected to database ${port}`);
  }
  );

app.listen(port,() => console.log(`Server running on port ${port}`));




// rutas
app.get("/",(req,res) => {
  res.send("Prueba BACKEND ");
});


// rest api
app.get("/productos",(req,res) =>{
  const sql = "SELECT * FROM productos";
  connection.query(sql,(err,result) =>{
    if(err) throw err;
    if(result.length > 0 ){
      res.json(result);
    }else{
      res.send("no hay productos");
    }
  });
});

app.get("/productos/:id",(req,res) =>{
  const {id} = req.params;
  const sql = `SELECT * FROM productos where productos.producto_id = ${id}`;
  connection.query(sql,(err,result) =>{
    if(err) throw err;
    if(result.length > 0 ){
      res.json(result);
    }else{
      res.send("no hay productos");
    }
  });
});

app.post("/agregar",(req,res) =>{
  const sql = "INSERT INTO productos SET ?";
  const producto = {
    nombre: req.body.nombre,
    categoria: req.body.categoria,
    precio: req.body.precio
  }
  connection.query(sql,producto,err => {
    if(err) throw err;
    res.send("Producto Creado");
  });
});


app.put("/actualizar/:id",(req,res) =>{
  const {id} = req.params;
  const {nombre,categoria,precio} = req.body;
  const sql = `UPDATE productos SET productos.nombre = '${nombre}', productos.categoria = '${categoria}', productos.precio = '${precio}' where productos.producto_id = ${id}`;
  connection.query(sql,err =>{
    if(err) throw err;
    res.send("producto actualizado");
  });
});


app.delete("/borrar/:id",(req,res) =>{
  const {id} = req.params;
  const sql = `DELETE FROM productos WHERE productos.producto_id = ${id}`;
  connection.query(sql, err => {
    if(err) throw err;
    res.send("Producto Borrado");
  });
 
});

