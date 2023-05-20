import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import  jwt  from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator'

/** Middleware for verify user */
export async function verifyUser(req,res,next){
    try {
        const {email} = req.method == "GET" ? req.query: req.body;

        let exist = await UserModel.findOne({email});
        if(!exist) return res.status(404).send({error:"Can't find user!"});
        next();

    } catch (error) {
        return res.status(404).send({error:"Authentication error"})        
    }
}

export async function signup(req,res){

    try {
        const { username,reg_no, password, profile, email } = req.body;        

        // check the existing user
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });
        const existReg_no = new Promise((resolve, reject) => {
            UserModel.findOne({ reg_no }, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({ error : "Please use unique username"});

                resolve();
            })
        });

        // check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function(err, email){
                if(err) reject(new Error(err))
                if(email) reject({ error : "Please use unique Email"});

                resolve();
            })
        });


        Promise.all([existUsername, existEmail])
            .then(() => {
                if(password){
                    bcrypt.hash(password, 10)
                        .then( hashedPassword => {
                            
                            const user = new UserModel({
                                username,
                                reg_no,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

                            // return save result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User Register Successfully"}))
                                .catch(error => res.status(500).send({error}))

                        }).catch(error => {
                            return res.status(500).send({
                                error : "Enable to hashed password"
                            })
                        })
                }
            }).catch(error => {
                return res.status(500).send({ error })
            })


    } catch (error) {
        return res.status(500).send(error);
    }

}


/** post: http://localhost:5000/api/login 
    email : "abc@gmail.com"
    password:  "admin123"
*/
export async function login(req, res) {
    const {email,password} = req.body;

    try {
        UserModel.findOne({email})
            .then(user=>{
                bcrypt.compare(password,user.password)
                    .then(passwordCheck=>{
                        if(!passwordCheck){
                            return res.status(400).send({error: "Don't have password"})
                        }

                        //create jwt token
                        const token=jwt.sign({
                                    userId: user._id,
                                    email:user.email
                                },ENV.JWT_SECRET,{expiresIn: '24h'});

                         return res.status(200).send({
                            msg: "Login successful...!",
                            email: user.email,
                            token
                        })       
                    })
                    .catch(error=>{
                        return res.status(404).send({error: "password not found"})
                    })
            })
            .catch(error=>{
                return res.status(404).send({error: "email not found"})
            })
    } catch (error) {
        return res.status(500).send({error});
    }
}


/** get: http://localhost:5000/api/user/abc@gmail.com 
   
*/
export async function getUser(req, res) {
   const {email} = req.params;

   try {

        if(!email) return req.status(501).send({error:"Invalid email"});

        UserModel.findOne({email},function(err,user){
            if(err) return res.status(500).send({err});
            if(!user) return res.status(501).send({error:"Couldn't find the user"});

            const {password,...rest} =Object.assign({},user.toJSON(user)) ;

            return res.status(201).send(rest);
        })
   } catch (error) {
    res.status(404).send({error:"Can't find user data"}) 
   }

}


export async function updateUser(req,res){
    try {
        
        
        // const id = req.query.id;
        const {userId} = req.user;

        if(userId){
            const body = req.body;

            // update the data
            UserModel.updateOne({ _id : userId }, body, function(err, data){
                if(err) throw err;

                return res.status(201).send({ msg : "Record Updated...!"});
            })

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}

export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({ code: req.app.locals.OTP })
}

export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verified Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}

//Redirect user when OTP is valid
export async function createResetOTP(req, res) {
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false;
        return res.status(201).send({msg:"Access granted...!"})
   }
   return res.status(440).send({error : "Session expired!"})
}

//update the password when OTP is verified
export async function resetPassword(req, res) {

    try {

        if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

        const {email, password} = req.body;
        try {
            UserModel.findOne({email})
                .then(user=>{
                    bcrypt.hash(password,10)
                        .then(hashedPassword=>{
                            UserModel.updateOne({email: user.email},
                                {password:hashedPassword},function(err,data){
                                    if(err) throw err;
                                    return res.status(201).send({msg:"Record uppdated...!"})
                                })
                        })
                        .catch(error=>{
                            return res.status(500).send({
                                error:"Enable to hashed password"
                            })
                        })
                })
                .catch(error=>{
                    return res.status(404).send({error:"Email not found"})
                })
        } catch (error) {
            return res.status(500).send({error})
        }
    } catch (error) {
        return res.status(401).send({error})
    }
}