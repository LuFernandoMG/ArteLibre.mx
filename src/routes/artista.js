const express = require('express');
const router = express.Router();
const pool = require('../database');

const { isArtista } = require('../lib/auth');
const { isLoggedIn } = require('../lib/auth');
const stripe = require('stripe')('sk_test_6WBQDi7VDQidnFxhgzQOtNBT007MvmFzD4');

var artista = false;
var logueado = false;
var dashboard = false;

const Handlebars = require('handlebars');


Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

router.get("/connect/oauth", isLoggedIn, isArtista, async (req, res) => {
	const { code, state } = req.query;
  
	// Send the authorization code to Stripe's API.
	stripe.oauth.token({
		grant_type: 'authorization_code',
		code
	  }).then(
		async (response) => {
		  var connected_account_id = response.stripe_user_id;
		  await saveAccountId(connected_account_id, req, res);
	
      // Render some HTML or redirect to a different page.
      req.flash('success', 'Registro Exitoso')
      res.redirect('/dashboard/rendimiento');
		},
		(err) => {
			console.log(err)
		  if (err.type === 'StripeInvalidGrantError') {
			return res.status(400).json({error: 'Invalid authorization code: ' + code});
		  } else {
			return res.status(500).json({error: 'An unknown error occurred.'});
		  }
		}
	  );
  });
  
   
  async function saveAccountId (id, req, res) {
  // Save the connected account ID from the response to your database.
  console.log(id)
	const id_stripe = {
		id_stripe : id,
		estado : 'Registrado',
		id_user : req.user.id
	}
	await pool.query('INSERT INTO artistStripe SET?', [id_stripe]);
	
  console.log('Connected account ID: ' + id);

  }


//
// Dashboard
//




router.get('/dashboard', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const obras = await pool.query('SELECT * FROM obras WHERE artista_id =? ORDER BY visitas DESC LIMIT 5', [req.user.id]);
  const colecciones = await pool.query('SELECT * FROM colecciones WHERE artista_id =? ORDER BY visitas DESC LIMIT 5', [req.user.id]);


  res.render('artist/dashboard', { nombre: nombre[0], artista, logueado, dashboard, obras, colecciones });
});

router.get('/dashboard/ventas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-ventas', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/dashboard/eventos', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-eventos', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/dashboard/subastas', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-subastas', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/dashboard/colecciones', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const colecciones = await pool.query('SELECT * from coleccionArtista WHERE artista_id =?', [req.user.id]);
  res.render('artist/mis-colecciones', { nombre: nombre[0], artista, logueado, dashboard, colecciones });
});

router.get('/dashboard/rendimiento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido, email FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const email = nombre[0].email;
  const url = req.url;
  const artistStripe = await pool.query('SELECT * FROM artistStripe WHERE id_user =? LIMIT 1', [req.user.id]);
  var stripeRegistro = false;
  if (artistStripe.length > 0) {
    stripeRegistro = true;
  }
  console.log(stripeRegistro)
  res.render('artist/mi-rendimiento', { nombre: nombre[0], artista, logueado, email, url, dashboard, stripeRegistro });
});

router.get('/dashboard/obras', isLoggedIn, isArtista, async (req, res) => {
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/mis-obras', { obras, nombre: nombre[0], artista, logueado, dashboard });
});

//
// Dashboard nuevos elementos GET
//

router.get('/dashboard/nuevo-evento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard-nuevo-evento', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/dashboard/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  const artistainfo = ('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  console.log(artistainfo)
  const colecciones = await pool.query('SELECT nombreColeccion, id from colecciones WHERE artista_id =?', [artistainfo[0]]);
  res.render('artist/dashboard-nueva-obra', { nombre: nombre[0], colecciones, artista, logueado, dashboard });
});

router.get('/dashboard/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = true;
  res.render('artist/dashboard-nueva-coleccion', { nombre: nombre[0], artista, logueado, dashboard });
});

//
// Nuevos elementos por fuera del dashboard GET
//

router.get('/nuevo-evento', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/nuevo-evento', { nombre: nombre[0], artista, logueado, dashboard });
});

router.get('/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = false;
  const artistainfo = ('SELECT id FROM artistas WHERE user_id =?', [req.user.id]);
  console.log(artistainfo)
  const colecciones = await pool.query('SELECT nombreColeccion, id from colecciones WHERE artista_id =?', [artistainfo[0]]);
  res.render('artist/nueva-obra', { nombre: nombre[0], colecciones, artista, logueado, dashboard });
});

router.get('/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/nueva-coleccion', { nombre: nombre[0], artista, logueado, dashboard });
});

//
// Nuevos elementos POST
//

router.post('/nueva-obra', isLoggedIn, isArtista, async (req, res) => {
  //GUARDANDO DATOS DE LA OBRA//
  const { nombreObra, coleccion, creacion, tecnica, estilo, precioFinal, ancho, alto, subasta, copias, descripcion, lcreacion, fcreacion } = req.body;
  var nombreColeccion = 'N/A';
  var subastar = 'No';

  if (subasta == 'on') {
    subastar = 'Si';
  }

  if (coleccion > 0) {
    nombreColeccion = await pool.query('SELECT nombreColeccion FROM colecciones WHERE id =?', [coleccion]);
    nombreColeccion = nombreColeccion[0];
  }
  const newObra = {
    nombreObra: nombreObra,
    coleccion: nombreColeccion.nombreColeccion,
    coleccion_id: coleccion,
    lugarCreacion: lcreacion,
    fecha_creacion: fcreacion,
    tecnica,
    estilo,
    ancho,
    alto,
    subastar,
    precio : precioFinal,
    descripcion,
    artista_id: req.user.id
  }

  const obra = await pool.query('INSERT INTO obras set ?', [newObra]);

  if (subastar == 'Si') {
    const newSubasta = {
      obra_id: obra.insertId
    }

    await pool.query('INSERT INTO subastasInfo set ?', [newSubasta]);
  }



  const artista_obras = await pool.query('SELECT * FROM obras WHERE artista_id =?', [req.user.id]);
  const numero_obras = {
    numero_obras : artista_obras.length
  }

  await pool.query('UPDATE artistas SET? WHERE id =?', [numero_obras, req.user.id]);

  //GUARDANDO FOTOS DE LA OBRA//

  const fotos = req.files;
  var principal = 'false';
  for (var i = 0; i < fotos.length; i++) {
    if (i == fotos.length - 1) {
      principal = true;
    }
    const path = fotos[i].path;
    var originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: obra.insertId
    }

    const foto = await pool.query('INSERT INTO fotosObras set ?', [newFoto]);
  }
  artista = true;
  logueado = true;

  const todoColeccicones = await pool.query('SELECT * from colecciones WHERE id =?', [coleccion])
  if (todoColeccicones.length > 0 ) { 
    var precioPromedio = todoColeccicones[0].precioPromedio + precioFinal;
    const colecicon_obras = await pool.query('SELECT * FROM obras WHERE coleccion_id =?', [coleccion]);
    var piezas = 0;
    if (colecicon_obras) {
      piezas = colecicon_obras.length;
    }
    else {
      piezas + 1;
    }
    const NewColeccion = {
      fotoNombre: originalname,
      precioPromedio,
      piezas
    }
  await pool.query('UPDATE colecciones set? WHERE id=?', [NewColeccion, coleccion]);
  }

  if (dashboard) {
    res.redirect('/artista/dashboard')
  } else {
    res.redirect('/dashboard/obras');
  };
});

router.post('/nueva-coleccion', isLoggedIn, isArtista, async (req, res) => {
  const { nombre, año, descripcion, estilo, tecnica, ubicacionPais, ubicacionCiudad } = req.body;
  const newColeccion = {
    nombreColeccion: nombre,
    anio: año,
    descripcion,
    estilo,
    tecnica,
    pais: ubicacionPais,
    ciudad: ubicacionCiudad,
    artista_id: req.user.id
  }
  await pool.query('INSERT into colecciones SET ?', [newColeccion]);

  const artista_colecciones = await pool.query('SELECT * FROM colecciones WHERE artista_id =?', [req.user.id]);
  const numero_colecciones = {
    numero_colecciones : artista_colecciones.length
  }

  await pool.query('UPDATE artistas SET? WHERE id =?', [numero_colecciones, req.user.id]);

  if(dashboard) {
    res.redirect('/artista/dashboard-nueva-obra')
  } else {
    res.redirect('nueva-obra');
  };
});


router.post('/nuevo-evento', isLoggedIn, isArtista, async (req,res) => {
  const {nombre, titulo, organizadores, hora, inicio, fin, local, direccion, piezas, ciudad, pais, estilo, descripcion } = req.body;
  const newEvento = {
    nombre,
    titulo,
    organizadores,
    hora_inicio: hora,
    fecha_inicio: inicio,
    fecha_fin: fin,
    dir_local: local,
    direccion,
    ciudad,
    pais,
    piezas,
    estilo,
    descripcion,
    artista_id: req.user.id
  }

  const evento = await pool.query('INSERT INTO eventos SET?', [newEvento] );
  const artista_eventos = await pool.query('SELECT * FROM eventos WHERE artista_id =?', [req.user.id]);
  const numero_eventos = {
    numero_eventos : artista_eventos.length
  }

  await pool.query('UPDATE artistas SET? WHERE id =?', [numero_eventos, req.user.id]);

   for (var i = 0 ; i<req.files.length; i ++) {
     var principal = 'false';
      if (i==0) { 
        principal = 'true';
      }
      else {
        principal = 'false';
      }
      const {originalname, path} = req.files[i];
      const newFotoEvento = {
        fotoNombre: originalname,
        fotoUbicacion: path,
        evento_id: evento.insertId,
        principal
      }
      await pool.query('INSERT INTO fotosEventos SET?', [newFotoEvento]);
    }
    if(dashboard) {
      res.redirect('/artista/dashboard')
    } else {
      res.redirect('/dashboard/eventos')
    };
});

router.post('/obra/editar/:id', isLoggedIn, isArtista, async (req, res)=> {
  const {id} = req.body;

    //ACTUALIZANDO DATOS DE LA OBRA//
    const {nombre, coleccion, creacion, tecnica, estilo, precio, ancho, alto, subasta, copias, descripcion,lcreacion, fcreacion} = req.body;
    var nombreColeccion = 'N/A';

    if (coleccion > 0) { 
      nombreColeccion = await pool.query('SELECT nombreColeccion FROM colecciones WHERE id =?', [coleccion]);
      nombreColeccion = nombreColeccion[0];
    }
    const newObra = {
      nombreObra : nombre,
      coleccion : nombre,
      coleccion_id : coleccion,
      lugarCreacion: lcreacion,
      fecha_creacion : fcreacion,
      tecnica,
      estilo,
      ancho,
      alto,
      precio,
      descripcion,
      artista_id : req.user.id
    }

    const obra = await pool.query('UPDATE obras set ? WHERE id =?', [newObra, id]);

    //GUARDANDO FOTOS DE LA OBRA//

    const fotos = req.files;
    var principal = 'false';
    for (var i = 0; i<fotos.length; i++) {
    if (i == fotos.length-1) {
      principal = true;
    }
    const path = fotos[i].path;
    var originalname = fotos[i].originalname;
    const newFoto = {
      fotoNombre: originalname,
      fotoUbicacion: path,
      principal,
      obra_id: id
    }

    const foto = await pool.query('INSERT INTO fotosObras set ?', [newFoto]);
    }
    const fotoColeccion = {
    fotoNombre: originalname
    }
    await pool.query('UPDATE colecciones set? WHERE id=?', [fotoColeccion, coleccion])

  res.redirect('/obra/'+id);
});

//
// Perfil
//

router.get('/artist-perfil', isLoggedIn, isArtista, async (req, res) => {
  const nombre = await pool.query('SELECT nombre, apellido FROM users WHERE id =?', [req.user.id]);
  const user = await pool.query('SELECT * FROM usuarioArtista WHERE id =?', [req.user.id]);
  const obras = await pool.query('SELECT * FROM obraCompleta WHERE artista_id =?', [req.user.id]);
  var ultima_obra = {
    nombreObra: 'N/A',
    id: '#'
  }
  if (obras.length > 0) {
    ultima_obra = obras[obras.length - 1];
  }
  artista = true;
  logueado = true;
  dashboard = false;
  res.render('artist/perfil', { nombre: nombre[0], user: user[0], obras, ultima_obra, artista, logueado, dashboard });
});

module.exports = router;