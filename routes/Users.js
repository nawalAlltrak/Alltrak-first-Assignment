const router = require('express').Router();

const { validateInput } = require('../functions/validateInput');
const User = require('../models/User');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split(".")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + ext;
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer(
    {
        storage: storage,
        fileFilter: function (req, file, callback) {
            console.log(file);
            let ext = file.originalname.split(".")[1]
            if (ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg') {
                // file.error = "Only Images are allowed!!"
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        },
    }).single("img");


router.get("/users/", function (req, res) {
    User.findAll()
        .then(users => { res.send(users); })
        .catch(err => { res.send(err.message) })
    // res.send("Users")
});


router.post("/user/create", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send(err.message)
        } else {
            const file = req.file;
            const data = req.body;
            const { name, email, phone, age, state } = data;

            const validationResponse = validateInput(data);

            if (validationResponse.isValid) {
                let img = file.path.replace("public", "").replace(/\\/g, "/");
                img = process.env.URL + img;
                User.create({ name, email, phone, age, state, img })
                    .then(user => {
                        console.log(user);
                        res.send(user);
                    })
                    .catch(err => {
                        console.log(err);
                        res.send(err);
                    })
            } else res.send(validationResponse.msg);
        }
    });

});

router.get("/user/:id", function (req, res) {
    const id = req.params.id;

    User.findOne({ where: { id: id } })
        .then(user => {
            if (!user) res.send("No User Exists");
            else res.send(user);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
})


module.exports = router;