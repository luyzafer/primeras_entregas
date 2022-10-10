//const http = require("http")
const { Router} = require("express");
const router = Router();
const Contenedor = require("../Contenedor.js");
const productsLogic = new Contenedor();
const Utility = require ('../Utility');
const Product = require("../Product.js");
const utilityTool = new Utility();
const product = new Product();


const { Console } = require("console");
const { Exception } = require("handlebars");

router.get('/list', async(req, res) => {
    console.log("aca fue")
    const books = await productsLogic.getAll()
    res.render("listOfBooks", {
        books,
      });
});


router.get('/productRandom', async (req, res)=>{
    const books = await productsLogic.getAll()
    const bookRandom = utilityTool.getRandomItem(books)
    res.render("datos", bookRandom)
            
});

router.get('/:id', async (req, res) => {
    console.log("byID")
    const id= req.params.id
    let productFound= await productsLogic.getById(id)
    res.json(productFound)
});

//Corregir enviar a pantalla de lista
router.post("/addNewBook", async (req, res) => {
    console.log("entre aca")
    productsLogic.getAll().then(items => utilityTool.getLastId(items)).then(id=> {
        let newProduct =  new Product(id+1, req.body.title, req.body.price, req.body.thumbnail)
        productsLogic.save(newProduct)
        res.json(newProduct)
       // res.redirect("/tasks/list");
    })
});

router.get("/addNewBook", (req, res) => {
    console.log("entre aca")
    const formInfo={
      botonName:"Crear",
      metodo:"POST",
      url:"/api/products/addNewBook"
    }
    res.render("addProduct",formInfo);
  });
  

router.put("/edit/:id", async (req, res) => {
    console.log("entre aca")
    const {id, title, price, thumbnail} = req.body
    const product = new Product(id, title, price, thumbnail)

    console.log(await productsLogic.update(product))
    
});

router.get("/edit/:id",async (req,res)=>{
    console.log("edit id get")
    const {id}  = req.params;
    const productToEdit =  await productsLogic.getById(id)
    console.log(productToEdit)
    const formInfo={
        botonName:"Edit",
        metodo:"PUT",
        url:"/api/products/edit/"+id
    }
    res.render("addProduct", {productToEdit, ...formInfo});
});


router.delete('/deleteAll',  (req, res) => {
    productsLogic.deleteAll().then(item => res.send("All products where deleted"))
}); 


router.delete('/delete/:id',  (req, res) => {
    console.log("delete")
    const id= req.params.id
    productsLogic.deleteById(id).then(item=> res.send("Removed the product" + id))
}); 

module.exports =router;