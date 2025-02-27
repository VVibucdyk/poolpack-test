const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
// ======================================
// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse application/json
app.use(bodyParser.json());
// Serve static files
app.use(express.static('public'));

// Create connection to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "poolpack-test",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});
// ======================================

// ================== START REST API CRUD SISWA ===================

// Create
app.post("/siswa", (req, res) => {
  const user = { nama_siswa: req.body.fname, alamat: req.body.alamat, id_kota: req.body.kabupaten_id, id_kecamatan: req.body.kecamatan_id, id_provinsi: req.body.provinsi_id };
  if(user.nama_siswa == '' || user.alamat == '' || user.id_kota == '' || user.id_kecamatan == ''){
    return res.status(400).send('Semua data harus diisi');
  }

    const checkSql = 'SELECT * FROM siswa WHERE nama_siswa = ?';
    db.query(checkSql, [user.nama_siswa], (err, result) => {
    
        if (result.length > 0) {
        return res.status(400).send('Siswa sudah ada');
        }

        const sql = "INSERT INTO siswa SET ?";
        db.query(sql, user, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }); 
});

// Read
app.get("/siswa", (req, res) => {
  const sql = "SELECT * FROM siswa INNER JOIN kabupaten ON siswa.id_kota=kabupaten.id_kabupaten INNER JOIN kecamatan ON siswa.id_kecamatan=kecamatan.id_kecamatan INNER JOIN provinsi ON siswa.id_provinsi=provinsi.id;";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get("/siswa/single/:id", (req, res) => {
  const sql = "SELECT * FROM siswa INNER JOIN kabupaten ON siswa.id_kota=kabupaten.id_kabupaten INNER JOIN kecamatan ON siswa.id_kecamatan=kecamatan.id_kecamatan WHERE id_siswa = ?;";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Update
app.put("/siswa/:id", (req, res) => {
  const id = req.params.id;
  const { fname, kabupaten_id, kecamatan_id, alamat, id_siswa } = req.body;
  const sql = "UPDATE siswa SET nama_siswa = ?, id_kota = ?, id_kecamatan = ?, alamat = ? WHERE id_siswa = ?";
  db.query(sql, [fname, kabupaten_id, kecamatan_id, alamat, id_siswa], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Delete
app.delete("/siswa/delete", (req, res) => {
  const id = req.body.id;
  const sql = "DELETE FROM siswa WHERE id_siswa = ?";
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ================= END REST API CRUD SISW ==================

// ================== START REST API CRUD KECAMATANN ===================
// Create
app.post("/kecamatan", (req, res) => {
    // check kecamatan
    const user = { kecamatan: req.body.kecamatan, id_kabupaten: req.body.kabupaten_id };
    if(user.kecamatan == '' || user.id_kabupaten == ''){
      return res.status(400).send('Semua data harus diisi');
    }
    const checkSql = 'SELECT * FROM kecamatan WHERE kecamatan = ?';
    db.query(checkSql, [user.kecamatan], (err, result) => {
        if (result.length > 0) {
          return res.status(400).send('Kecamatan sudah ada');
        }
    
        const sql = "INSERT INTO kecamatan SET ?";
        db.query(sql, user, (err, result) => {
          if (err) throw err;
          res.send(result);
        });
    });
  });
  
  // Read
  app.get("/kecamatan", (req, res) => {
    const sql = "SELECT * FROM kecamatan INNER JOIN kabupaten ON kecamatan.id_kabupaten=kabupaten.id_kabupaten;";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get("/kecamatan/single/:id", (req, res) => {
    const sql = "SELECT * FROM kecamatan WHERE id_kecamatan = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
  
  // Update
  app.put("/kecamatan/:id", (req, res) => {
    const id = req.params.id;
    const { kecamatan, kabupaten_id, id_kecamatan } = req.body;
    const sql = "UPDATE kecamatan SET kecamatan = ?, id_kabupaten = ? WHERE id_kecamatan = ?";
    db.query(sql, [kecamatan, kabupaten_id, id_kecamatan], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
  
  // Delete
  app.delete("/kecamatan/delete", (req, res) => {
    const data = { id_kecamatan: req.body.id_kecamatan };
    const sql = "DELETE FROM kecamatan WHERE id_kecamatan = ?";
    db.query(sql, data.id_kecamatan, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
// ================== END REST API CRUD KECAMATAN =====================

// ####################################################################################################

// ================== START REST API CRUD KABUPATEN ===================
// Create
app.post("/kabupaten", (req, res) => {
    // Check kabupaten
    const user = { kabupaten: req.body.kabupaten };
    if(user.kabupaten == ''){
        return res.status(400).send('Semua data harus diisi');
    }
    const checkSql = 'SELECT * FROM kabupaten WHERE kabupaten = ?';
    db.query(checkSql, [user.kabupaten], (err, result) => {
    
        if (result.length > 0) {
          return res.status(400).send('Kabupaten sudah ada');
        }
    
        const insertSql = 'INSERT INTO siswa (id_siswa, fname, id_kota, id_kecamatan, alamat) VALUES (?, ?, ?, ?, ?)';
        const sql = "INSERT INTO kabupaten SET ?";
        db.query(sql, user, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    });
  });
  
  // Read
  app.get("/kabupaten", (req, res) => {
    const sql = "SELECT * FROM kabupaten";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
  
  app.get("/kabupaten/single/:id", (req, res) => {
    const sql = "SELECT * FROM kabupaten WHERE id_kabupaten = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
  
  // Update
  app.post("/kabupaten/:id", (req, res) => {
    const id = req.params.id;
    const { kabupaten } = req.body;
    console.log(kabupaten)
    const sql = "UPDATE kabupaten SET kabupaten = ? WHERE id_kabupaten = ?";
    db.query(sql, [kabupaten, id], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
  
  // Delete
  app.delete("/kabupaten/delete", (req, res) => {
    const data = { id_kabupaten: req.body.id_kabupaten };
    const sql = "DELETE FROM kabupaten WHERE id_kabupaten = ?";
    db.query(sql, [data.id_kabupaten], (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });

  app.get("/provinsi", (req, res) => {
    const sql = "SELECT * FROM provinsi";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.send(results);
    });
  });
// ================== END REST API CRUD KABUPATEN =====================

// ================== Start Addon API =====================

app.post('/getKecamatanBasedOnKabupaten', (req, res) => {
    const id = req.body.id_kabupaten
    const sql = "SELECT * FROM kecamatan WHERE id_kabupaten = ?"
    db.query(sql, id, (err, result) => {
        if (err) throw err
        res.send(result)
    })
})

app.post('/getKabupatenBasedOnProvinsi', (req, res) => {
  const id = req.body.id_provinsi
  const sql = "SELECT * FROM kabupaten WHERE id_provinsi = ?"
  db.query(sql, id, (err, result) => {
      if (err) throw err
      res.send(result)
  })
})



// ================== END addon API ======================