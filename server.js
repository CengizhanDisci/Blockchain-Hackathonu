var express = require("express")
var sql = require('mssql')
var bodyParser = require("body-parser")
var db = require("./dbConfig")
var app = express()
var crypto = require('crypto')
const res = require("express/lib/response")
let {PythonShell} = require('python-shell')
const NodeRSA=require('node-rsa');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.static(__dirname + "/public"))





app.get('/', (req, res) => {
    res.status(200).redirect('/login')
})

app.get('/register', (req, res) => {
    // res.sendFile('./public/views/register.html', { root: __dirname });
     res.status(200).sendFile(path.join(__dirname + "/public/views/register.html"))
 })
  
app.get('/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/public/views/login.html'))
})

app.get('/users/getAll', (req, res) => {
    db.connect().then((result) => {
        if (result.connected) {
            console.log('Server has connected ...');
            result.request().query('select * from personInfo ', (err, data) => {
                if (err) {
                    throw err;
                }
                res.send(data.recordset);
            })
        }
    })
})

app.get('/blockchain.html', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/public/views/blockchain.html'))
    //res.sendFile("./public/views/blockchain.html", { root: __dirname })
})

app.get('/hash.html', (req, res) => {
    // res.sendFile("./public/views/hash.html", { root: __dirname })
    res.status(200).sendFile(path.join(__dirname + "/public/views/hash.html"))
})

app.get('/block.html', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/public/views/block.html'))
    //res.sendFile("./public/views/block.html", { root: __dirname })
})
app.get('/distributed.html', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/public/views/distributed.html'))
    //res.sendFile("./public/views/distributed.html", { root: __dirname })
})



app.get('/login.html', (req, res) => {

    res.sendFile(__dirname+"/"+"login.html")
})




app.post('/pythonDeneme',(req,res)=>{

    var text=req.body.text
    var pythonValueBack;
    
        let options={
            args:[text]
        }
        db.connect().then((result) => {
            if (result.connecting) {
                console.log("bağlanıyor")
            }
            if (result.connected) {
                console.log("bağlandı ekleme")
                PythonShell.run('stringChanger.py',options,function(err,results){
                    if (err) throw err;
                    
                    pythonValueBack=results.toString()  
                    result.request().input("text",sql.NVarChar,pythonValueBack).query("INSERT INTO dbo.tblPython (Döndürülen) VALUES (@text)",(err)=>{
                        if(err) throw err;
                        console.log("veritabanına ekleme başarılı");
                        res.send("veritabanına ekleme başarılı!")
                    })
                    
                    console.log(pythonValueBack)
                    console.log("Python script finished.")
                })
                
            }
        })
    
        
        
    })
    
      

app.post('/login',function(req,res){
    var userName = req.body.userName
    var userPassword=req.body.userPassword
    var selectedUserId;
    var selectedUserName;
    var selectedUserPassword
    db.connect().then((result) => {
        if (result.connecting) {
            console.log("bağlanıyor")
        }
        if (result.connected) {
            console.log("bağlandı ekleme")
            result.request().input("x",sql.NVarChar,userName).input("p",sql.NVarChar,userPassword).query("SELECT userName,userPassword,userId from tblUser WHERE userName=@x AND userPassword=@p",(err,r)=>{
                if (err) {
                    throw err;
                }
                selectedUserName=JSON.stringify(r.recordset[0]["userName"])
                selectedUserPassword=JSON.stringify(r.recordset[0]["userPassword"])
                selectedUserId=JSON.stringify(r.recordset[0]["userId"])

                if(selectedUserName===JSON.stringify(userName)&& selectedUserPassword===JSON.stringify(userPassword)){
                    console.log("giriş başarılı");
                    res.send("Giriş Başarılı!");
                    result.request().input("id",sql.Int,selectedUserId).query("exec loginInfo @id",(err,resulttt)=>{
                        if(err){
                            throw err;
                        }
                        console.log("Login Bilgileri İşlendi.")
                    })

                }
                else{
                    console.log("giriş başarısız")
                    res.send("giriş başarısız")                
                }
            })

        
        }
    })

})

app.post('/update',(req,res) => {
    var hashAmount = crypto.createHash('sha256').update(JSON.stringify(req.body.hashAmount)).digest('hex')
    var eventId = req.body.eventId
    db.connect().then((result) => {
        if (result.connecting) {
            console.log("bağlanıyor")
        }
        if (result.connected) {
            console.log("bağlandı ekleme")
            result.request()
            .input('x', sql.NVarChar, hashAmount)
            .input('id',sql.Int,eventId)
            .query("update tblEventHistory SET totalAmount = @x WHERE eventId=@id", (err) => {
                if (err) {
                    throw err;
                }
                console.log("basarili")
                res.send("basarili")
            })
        
        }
    })
})


app.post('/register/createUser', (req, res) => {
    var userName = req.body.userName
    var userPassword = req.body.userPassword
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var identityNumber = req.body.identityNumber
    var birthDate = req.body.birthDate
    var address = req.body.address

    db.connect().then((result) => {
        if (result.connecting) {
            console.log("bağlanıyor")
        }
        if (result.connected) {
            console.log("bağlandı ekleme")
            result.request()
            .input('x', sql.NVarChar, userName)
            .input('p', sql.NVarChar, userPassword)
            .query("exec register @x,@p", (err) => {
                if (err) {
                    throw err;
                }

                console.log("ekleme işlemi başarılı");
                
                result.request()
                .input('userName', sql.NVarChar, userName)
                .input('userPassword', sql.NVarChar, userPassword)
                .output('userId', sql.Int)
                .query("SELECT userId FROM tblUser WHERE userName=@userName and userPassword=@userPassword", (err, resu) => {
                    if (err) {
                        throw err;
                    }

                    userIdNumber = JSON.stringify(resu.recordset[0]["userId"])

                    result.request().input('fn', sql.NVarChar, firstName)
                        .input('ln', sql.NVarChar, lastName)
                        .input('in', sql.BigInt, identityNumber)
                        .input('ui', sql.Int, userIdNumber)
                        .input('bd', sql.Date, birthDate)
                        .input('ad', sql.NVarChar, address)
                        .query("insert into dbo.tblPerson (firstName,lastName,identityNumber,userId,birtDate,Adress) VALUES (@fn, @ln,@in,@ui,@bd,@ad)", (err) => {
                            if (err) {
                                throw err;
                            }
                            console.log("Başarılı")
                        })

                })
            })
        }
    })
    res.status(200).redirect('/');
})


var eventId;
var prevAmount;
app.post('/moneyTransferAmoungUsers', (req, res) => {
    var hashAmount = crypto.createHash('sha256').update(JSON.stringify(req.body.Amount)).digest('hex')
    var userId = req.body.userId
    var ReceiverId = req.body.ReceiverId
    var hashnegativeAmount = crypto.createHash('sha256').update(JSON.stringify(req.body.Amount - (req.body.Amount * 2))).digest('hex')
    var Amount = req.body.Amount
    var negativeAmount = Amount - (Amount * 2)

    const key = new NodeRSA({b:1024});

    var public_key=key.exportKey('public')
    var private_key=key.exportKey('private')

    let key_public = new NodeRSA(public_key);
    const iv = private_key;
    var encryptedString = key_public.encrypt(hashAmount,'base64')

    db.connect().then((result) => {
        if (result.connecting) {
            console.log("bağlanıyor")
        }
        if (result.connected) {
            console.log("Bağlandı.")
            result.request()
            .input('x', sql.Int, userId)
            .input('p', sql.Int, negativeAmount)
            .query("exec addWalletAmount @x,@p", (err) => {
                if (err) {
                    throw err;
                }
                console.log("Gönderenin bakiyesi güncellendi!")
                result.request()
                .input('x', sql.Int, ReceiverId)
                .input('p', sql.Int, Amount)
                .query("exec addWalletAmount @x,@p", (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log("Parayı alanın bakiyesi güncellendi!")

                    result.request()
                    .output('id', sql.Int, eventId)
                    .query("SELECT dbo.maxEventId()", (err,resul) => {
                        if (err) {
                            throw err;
                        }
                        eventId = (resul.recordset[0][""])
                        result.request()
                        .input('id', sql.Int, eventId)
                        .output('pa', sql.NVarChar, prevAmount)
                        .query("select totalAmount from tblEventHistory where eventId = @id", (err,re) => {
                            if (err) {
                                throw err;
                            }           
                                prevAmount = (re.recordset[0]["totalAmount"])
                                result.request()
                                .input('uid', sql.Int, userId)
                                .input('pa', sql.NVarChar, prevAmount)
                                .input('rid', sql.Int, ReceiverId)
                                .input('ha', sql.NVarChar,encryptedString)
                                .input('iv',sql.NVarChar,iv)
                                .input('eID',sql.Int,eventId)
                                .query("exec moneyTransfer @uid,@rid,@ha,@pa,@iv,@eID", (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                    console.log("basarili")
                                    res.send("basarili")
    
                                })
                        
                        })


                    })
                })
            })


        }
    })
    

})

app.post('/addMoneyToWallet', (req, res) => {
    var Amount = req.body.Amount
    var userId = req.body.userId
    var currency= req.body.currency
    var currencyValue;
    db.connect().then((result) => {
        if (result.connecting) {
            console.log("bağlanıyor")
        }
        if (result.connected) {
            console.log("Bağlandı.")
            result.request().input('c',sql.NVarChar,currency).query("select currencyValue from tblCurrency where currency = @c",(err,r) =>{
                if(err) throw err
                currencyValue= JSON.stringify(r.recordset[0]['currencyValue'])
                Amount= Amount*currencyValue
                result.request()
                .input('x', sql.Int, userId)
                .input('p', sql.Int, Amount)
                .query("exec addWalletAmount @x,@p", (err) => {
                    if (err) {
                        throw err;                 
                    }
                    result.request()
                    .output('id', sql.Int, eventId)
                    .query("SELECT dbo.maxEventId()", (err,resul) => {
                        if (err) {
                            throw err;
                        }
                        eventId = (resul.recordset[0][""])
                        
                        result.request()
                        .input('id', sql.Int, eventId)
                        .output('pa', sql.NVarChar, prevAmount)
                        .query("select totalAmount from tblEventHistory where eventId = @id", (err,re) => {
                            if (err) {
                                throw err;
                            }           
                                prevAmount = (re.recordset[0]["totalAmount"])
                                
                                var hashAmount = crypto.createHash('sha256').update(JSON.stringify(Amount)).digest('hex')
                                const key = new NodeRSA({b:1024});
            
                                var public_key=key.exportKey('public')
                                var private_key=key.exportKey('private')
                            
                                let key_public = new NodeRSA(public_key);
                                const iv = private_key;
            
                                var encryptedAmount = key_public.encrypt(hashAmount,'base64')          

                                result.request()
                                .input('x',sql.Int,userId)
                                .input('p',sql.NVarChar,encryptedAmount)
                                .input('iv',sql.NVarChar,iv)
                                .input('pA',sql.NVarChar,prevAmount)
                                .input("eId",sql.Int,eventId)
                                .query("exec walletChanger @x,@p,@iv,@pA,@eId",(err)=>{
                                    if(err) throw err;
                                        console.log("BAŞARIYLA GERÇEKLEŞTİ");
                                })
                        
                        })


                    })


                    console.log("bakiye güncellendi!")
                    res.send("Bakiye Güncellendi!")
                })
            })

        }
    })
})




var server = app.listen(8081, () => {
    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})