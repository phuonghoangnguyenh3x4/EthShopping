const express = require('express');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const ipfsClient = require('ipfs-http-client');
const fs = require('fs');

const app = express();
const port = 3000;

const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });

app.use(express.static('src'))
app.use('/vendor', express.static('node_modules'))
app.use(express.static('eth/contracts'))
app.use(express.static('eth/abis'))
app.use(express.static('uploads'))

app.use(fileUpload({
	limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({
	extended: true
}));

app.get('/', function (req, res) {
	res.render('index.html')
})

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
})

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'eth_shop',
});

connection.connect(function (err) {
	if (err) {
		console.error('mysql error connecting: ' + err.stack);
		return;
	}

	console.log('mysql connected !');
	console.log('server ready !');
});

app.post('/create', function (req, res) {
	product = req.body;
	let sql = 'INSERT INTO products SET ?';
	connection.query(sql, product, (err, result) => {
		if (err) {
			console.error(err);
			res.json(err);
			return;
		}

		let success_str = 'Product added !';
		console.log(success_str);
		res.json(success_str);
	});
})

app.post('/edit', function (req, res) {
	let product = req.body;
	const id = product.id;
	delete product.id; 
	let sql = "UPDATE products \
			   SET ? \
			   WHERE id = ?";
	connection.query(sql, [product, id], (err, result) => {
		if (err) {
			console.error(err);
			res.json(err);
			return;
		}

		let success_str = 'Product edited !';
		console.log(success_str);
		res.json(success_str);
	});
})

app.get('/get', function (req, res) {
	let sql = `SELECT * FROM products`;

	let id = req.query.id;

	if (id) {
		sql += ` WHERE id = ` + id;
	}

	connection.query(sql, (err, result) => {
		if (err) {
			res.json(err);
			return;
		}

		res.json(result);
	});
})

function generateImageName(name) {
	let names = name.split(".");
	let filedname = names[0];
	let ext = names[names.length - 1];

	return filedname + new Date().getTime() + "." + ext;
}

app.post('/upload', async (req, res) => {
    try {
		if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
			let image = req.files.image;
			let name = generateImageName(image.name);
            image.mv('./uploads/' + name);

            res.status(200).send(name);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/get_link', function (req, res) {

	let owner = req.query.owner;
	owner = owner.substring(2).toLowerCase();
	let name = req.query.name;
	let encoded_name = Buffer.from(name).toString('hex');
	let link = encoded_name + owner;

	res.send(link);
})

app.post('/create_origin', async (req, res) => {
	try {
		const originFile = req.files.originFile;
		console.log()
		const file = {path: originFile.name, content: originFile.data }
		const filesAdded = await ipfs.add(file);
		console.log(filesAdded.cid.string);
		
		// if (!req.files) {
        //     res.send({
        //         status: false,
        //         message: 'No file uploaded'
        //     });
        // } else {
		// 	let image = req.files.image;
		// 	let name = generateImageName(image.name);
        //     image.mv('./uploads/' + name);

        res.status(200).send("Link: <a href=\"http://localhost:50230/ipfs/" + filesAdded.cid.string + "\">" + filesAdded.cid.string + "</a>");
    } catch (err) {
        res.status(500).send(err);
    }
});