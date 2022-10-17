import connection from "../src/db.js";
import dayjs from "dayjs";
import { validate } from "uuid";
import { urlSchema } from "../schemas/schemas.js";
import { nanoid } from "nanoid"

export async function urlsShorten(req, res){
    
    const token = req.headers.authorization.replace('Bearer ','').trim();
    const { url } = req.body;

    try{

        if(!token){
            return res.sendStatus(401);
        }

        const validation = urlSchema.validate(req.body);
        if (validation.error) {
            return res
                .status(422)
                .send(validation.error.details.map(detail => detail.message));
        }

        if(!(validURL(url))){
            return res.sendStatus(422);
        }

        const sessionExists = await connection.query('SELECT * FROM sessions WHERE token=$1',[token]);
    
        if(!(sessionExists.rows.length)){
            return res.sendStatus(401);
        }

        const userId = sessionExists.rows[0].userId;
        const shortUrl = nanoid()

        await connection.query('INSERT INTO urls ("userId",url,"shortUrl","createdAt","visitCount") VALUES ($1,$2,$3,$4,$5)', [userId, url, shortUrl, dayjs(),0]);

        return res
            .status(200)
            .send(shortUrl);



    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 


}

export async function getUrl(req, res){
    const { id } = req.params;

    try{
        const urlExists = await connection.query('SELECT * FROM urls WHERE id=$1', [id]);
        if(!(urlExists.rows.length)){
            return res.sendStatus(404);
        }

        return res.send({
            id: urlExists.rows[0].id,
            shortUrl: urlExists.rows[0].shortUrl,
            url: urlExists.rows[0].url
        });
        
        
    }
    catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 

}

export async function openUrl(req, res){
    const { shortUrl } = req.params;

    try{

        const urlExists = await connection.query('SELECT * FROM urls WHERE "shortUrl"=$1',[shortUrl]);
        if(!(urlExists.rows.length)){
            return res.sendStatus(404);
        }

        const originalUrl = urlExists.rows[0].url;

        return res.redirect(originalUrl);

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}
