const express = require("express");
const app = express();


app.get("/", (req, res) => {
  res.send("Servidor Express funcionando correctamente");
});

app.set("view engine","ejs");

app.get("/", function(req,res){
  res.render("ingresar.html");
});

app.listen(4000, function() { 
  console.log("Servidor creado en http://localhost:4000");
});
