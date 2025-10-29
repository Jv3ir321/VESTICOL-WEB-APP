const express= require ("express");
const app= express();
const path= require ("path");
const mysql = require ("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'usuario',   
    password: '12345',
    database: 'VESTICOL'
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

function error() {
    if (err) {
        console.log("Ha habido un error", err);
        return res.status(500).send("Ha habido un error");
    }
}


//Middlewares o pues para ver carpetas estaticas como imagenes css js XDXDXD
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

//Configuracion del motor de plantillas
app.set("view engine","ejs");
app.set("views","./views");

// Configuración de la sesión
app.use(session({
    secret: 'tu_clave_secreta_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // true en producción con HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
}));

app.get("/", (req,res) => {
    return res.render("inicio", { datos: req.session || {}}); // se hace de esta forma para evitar errores si no hay sesión
    // , porque si no hay sesión req.session es undefined y eso genera un error al intentar acceder a sus propiedades en el ejs
});

app.get("/sesionhombre", (req,res) => {
    const consultaProductos = "SELECT * FROM PRODUCTOS WHERE genero_producto = 'Masculino'";

    conexion.query(consultaProductos, (err, resultados) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).send('Error al obtener productos');
        }
        res.render("sesionhombre", { productos: resultados, datos: req.session || {} });
    });
});

app.get("/sesionhombre/:nombre_categoria", (req,res) => {
    const nombre_categoria = req.params.nombre_categoria;

    const consultaCategoria = "SELECT * FROM PRODUCTOS WHERE categoria_producto = ? AND genero_producto = 'Masculino'";
    conexion.query(consultaCategoria, [nombre_categoria], (err, resultados) => {
        if (err) {
            console.error('Error al obtener productos por categoría:', err);
            return res.status(500).send('Error al obtener productos');
        }

        res.render("sesionhombre", { productos: resultados, datos: req.session || {} });
    });
});

app.get("/sesionmujer", (req,res) => {
    const consultaProductos = "SELECT * FROM PRODUCTOS WHERE genero_producto = 'Femenino'";

    conexion.query(consultaProductos, (err, resultados) => {
        if (err) {
            console.log("Ha habido un error", err)
            res.status(500).send("Error al obtener los productos")
        }
        
        res.render("sesionmujer", { productos: resultados, datos: req.session || {}})

    })
});

app.get("/sesionmujer/:nombre_categoria", (req,res) => {
    const nombre_categoria = req.params.nombre_categoria

    const consultaCategoria = "SELECT * FROM PRODUCTOS WHERE categoria_producto = ? AND genero_producto = 'Femenino'";
    conexion.query(consultaCategoria, [nombre_categoria], (err, resultados) => {
        if (err) {
            console.log("Ha habido un error", err);
            res.status(500).send("Ha ocurrido un error al obtener productos")    
        }
        res.render("sesionmujer", {productos: resultados, datos: req.session || {}})
    })
});

app.get("/carrito", (req, res) => {
    // Verificar si el usuario ha iniciado sesión
    if (!req.session.login || !req.session.idUsuario) {
        return res.render("carrito", { 
            productos: [], 
            datos: req.session || {} 
        });
    }

    const cedula_usuario = req.session.idUsuario;

    // Consulta para obtener los productos del carrito con JOIN
    const consultaCarrito = `
        SELECT 
            o.codigo_orden,
            o.detalles_orden,
            p.cod_producto,
            p.nombre_producto,
            p.descripcion_producto,
            p.precio_producto,
            p.imagen_producto
        FROM ORDENES o
        INNER JOIN PRODUCTOS p ON o.cod_producto = p.cod_producto
        WHERE o.cedula_usuario = ?
        ORDER BY o.codigo_orden DESC
    `;

    conexion.query(consultaCarrito, [cedula_usuario], (err, resultados) => {
        if (err) {
            console.error('Error al obtener carrito:', err);
            return res.status(500).send('Error al obtener el carrito');
        }

        res.render("carrito", { 
            productos: resultados, 
            datos: req.session || {} 
        });
    });
});
app.get("/atencionalcliente", (req,res) => {
    res.render("atencionalcliente", {datos: req.session || {}});
});

app.get("/ingresar", (req,res) => {
    res.render("ingresar", {datos: req.session || {}});
});

app.get("/ingresar/iniciarsesion", (req,res) => {
    res.render("login", {datos: req.session || {}});
});

app.get("/detalleproducto/:cod_producto", (req,res) => {
    const cod_producto = req.params.cod_producto

    const consultaDetalle = "SELECT * FROM PRODUCTOS WHERE cod_producto= ? ";
    conexion.query(consultaDetalle, [cod_producto], (err, resultado) => {
        if (err) {
            console.error('Error al obtener detalle del producto:', err);
            return res.status(500).send('Error al obtener detalle del producto');
        }
        if (resultado.length === 0) {
            return res.status(404).send("Producto no encontrado");
        }

        const producto = resultado[0]

        res.render("detalleproducto", {datos: req.session || {}, producto: producto})
})




});

app.get("/sesionhombre/:nombre_categoria", (req, res) => {
    const nombre_categoria = req.params.nombre_categoria;

    const consultaCategoria = "SELECT * FROM PRODUCTOS WHERE categoria_producto = ?";
    conexion.query(consultaCategoria, [nombre_categoria], (err, resultados) => {
        error(err); 
        res.render("sesionhombre", { productos: resultados });
    
    });
});


app.post("/ingresar/registrar", async (req, res) => {
    const { correo, contrasena, nombre, apellido, documento_tipo, documento_numero, fechaNacimiento } = req.body;

    if (!correo || !contrasena || !nombre || !apellido || !documento_tipo || !documento_numero || !fechaNacimiento) {
        return res.status(400).send('Todos los campos son obligatorios');
    }
    
    const validacionCorreo = "SELECT * FROM USUARIOS WHERE correo_usuario = ?";
    conexion.query(validacionCorreo, [correo], (err, resultCorreo) => {
        if (err) {
            console.error('Error al validar correo:', err);
            return res.status(500).send('Error al validar correo');
        }
        if (resultCorreo.length > 0) {
            console.log('El correo ya está registrado');
            return res.status(400).send('El correo ya está registrado');
        }

        const validacionID = "SELECT * FROM USUARIOS WHERE cedula_usuario = ?";
        conexion.query(validacionID, [documento_numero], (err, resultID) => {
            if (err) {
                console.error('Error al validar documento:', err);
                return res.status(500).send('Error al validar documento');
            }
            if (resultID.length > 0) {
                console.log('El documento ya está registrado');
                return res.status(400).send('El documento ya está registrado');
            }

   
            const saltRounds = 10;
            bcrypt.hash(contrasena, saltRounds, (err, hashedPassword) => {
                if (err) {
                    console.error('Error al hashear contraseña:', err);
                    return res.status(500).send('Error al procesar contraseña');
                }

                const registro = "INSERT INTO USUARIOS (correo_usuario, password_usuario, nombre_usuario, apellido_usuario, tipo_doc_usuario, cedula_usuario, fc_nac_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)";
                
                conexion.query(registro, [correo, hashedPassword, nombre, apellido, documento_tipo, documento_numero, fechaNacimiento], (err, result) => {
                    if (err) {
                        console.error('Error al registrar usuario:', err);
                        return res.status(500).send('Error al registrar usuario');
                    }
                    console.log('Usuario registrado con éxito:', result);
                    res.redirect("/");
                });
            });
        });
    });
});

app.post("/ingresar/iniciarsesion/login", (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const consultaUsuario = "SELECT * FROM USUARIOS WHERE correo_usuario = ?";
    conexion.query(consultaUsuario, [correo], (err, resultados) => {
        if (err) {
            console.error('Error al consultar usuario:', err);
            return res.status(500).send('Error al consultar usuario');
        }

        if (resultados.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(404).send('Usuario no encontrado');
        }

        const usuario = resultados[0];
        const passwordHash = usuario.password_usuario; 
        // accedemos al hash almacenado en la base de datos por medio de la variable usuario que toma como valor el
        // primer elemento del arreglo resultados

        bcrypt.compare(contrasena, passwordHash, (err, coincide) => {
            if (err) {
                console.error('Error al comparar contraseñas:', err);
                return res.status(500).send('Error al procesar contraseña');
            }

            if (!coincide) {
                console.log('Contraseña incorrecta');
                return res.status(401).send('Contraseña incorrecta');
                
            }

            req.session.login = true;
            req.session.usuario = usuario.nombre_usuario;
            req.session.correo = usuario.correo_usuario;
            req.session.idUsuario = usuario.cedula_usuario;
            req.session.rolusr = usuario.rol_usuario;

            console.log('Inicio de sesión exitoso:', usuario.nombre_usuario);
            res.redirect("/");
        });
    });
});

app.post("/cerrarsesion", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        console.log('Sesión cerrada con éxito');
        res.redirect("/");
    });
});

app.post("/detalleproducto/:cod_producto/agregarcarrito", (req,res) => {
    const cod_producto = req.params.cod_producto;
    const cedula_usuario = req.session.idUsuario;
    const talla_pedido = req.body.talla;

    const añadirProductoDB = "INSERT INTO ORDENES(cedula_usuario, cod_producto, detalles_orden) VALUES (?, ?, ?)";
    conexion.query(añadirProductoDB, [cedula_usuario, cod_producto, talla_pedido], (err, result) => {
        if (err) {
            console.error('Error al añadir producto a la base de datos:', err);
                return res.status(500).send('Error al añadir producto');
            }

            console.log('Producto añadido al carrito:', {
                cedula_usuario,
                cod_producto,
                talla_pedido
            });
            res.redirect("/carrito");
        });
    });

app.post("/carrito/:codigo_orden/eliminar", (req, res) => {
    const codigo_orden = req.params.codigo_orden;

    const eliminarProductoDB = "DELETE FROM ORDENES WHERE codigo_orden = ?";
    conexion.query(eliminarProductoDB, [codigo_orden], (err, result) => {
        if (err) {
            console.error('Error al eliminar producto de la base de datos:', err);
            return res.status(500).send('Error al eliminar producto');
        }

        console.log('Producto eliminado del carrito:', {
            codigo_orden
        });
        res.redirect("/carrito");
    });
});

app.listen(4500,function(){
    console.log("Servidor Creado en http://localhost:4500");
});