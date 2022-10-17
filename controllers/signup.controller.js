import connection from "../src/db.js";
import dayjs from "dayjs";
import { signInSchema, signUpSchema } from "../schemas/schemas.js";
import { v4 as uuid} from "uuid"

export async function signUp(req, res){

    const newUser = req.body;

    try{
        const validation = signUpSchema.validate(newUser);

        if (validation.error) {
            return res
                .status(422)
                .send(validation.error.details.map(detail => detail.message));
        }

        if(newUser.password !== newUser.confirmPassword){
            console.log("Passwords don't match");
            return res.sendStatus(422)
        }

        const emailExists = await connection.query("SELECT * FROM users WHERE email=$1",[newUser.email]);

        if(emailExists.rows.length){
            console.log("This email is already in use")
            return res.sendStatus(409)
        }

        await connection.query('INSERT INTO users (name,email,password,"createdAt") VALUES ($1,$2,$3,$4)', [newUser.name, newUser.email, newUser.password, dayjs()]);
        return res.sendStatus(201);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 
}

export async function signIn(req, res){

    const loginUser = req.body;

    try{

        const validation = signInSchema.validate(loginUser);

        if (validation.error) {
            return res
                .status(422)
                .send(validation.error.details.map(detail => detail.message));
        }

        const userExists = await connection.query("SELECT * FROM users WHERE email=$1 AND password=$2",[loginUser.email, loginUser.password]);

        if(!(userExists.rows.length)){
            return res.sendStatus(401)
        }

        const token = uuid();
        
        return res 
            .status(200)
            .send({token: token})

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 

    
}