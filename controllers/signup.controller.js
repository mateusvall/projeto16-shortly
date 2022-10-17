import connection from "../src/db.js";
import { signUpSchema } from "../schemas/schemas.js";

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

        await connection.query('INSERT INTO users (name,email,password) VALUES ($1,$2,$3)', [newUser.name, newUser.email, newUser.password]);
        return res.sendStatus(201);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 
}