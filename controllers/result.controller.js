import connection from "../src/db.js";

export async function getUserUrls(req, res){

    let token = req.headers.authorization;

    try{

        if(!token){
            return res.sendStatus(401)
        }

        token = token.replace('Bearer ', '');

        const sessionExists = await connection.query(`SELECT * FROM sessions WHERE token=${token}`);

        if(!(sessionExists.rows.length)){
            return res.sendStatus(401);
        }

        const userId = sessionExists.rows[0].userId;

        const userExists = await connection.query(`SELECT * FROM users WHERE id=$1`, [userId]);

        if(!(userExists.rows.length)){
            return res.sendStatus(404)
        }

        const userUrls = await connection.query(`SELECT * FROM urls WHERE "userId"=$1`, [userId]);

        const sum = userUrls.rows.reduce((accumulator, object) => {
            return accumulator + object.visitCount;
          }, 0);

        return res.send({
            id: userExists.rows[0].id,
            name: userExists.rows[0].name,
            visitCount: sum,
            shortenedUrls: userUrls.rows.map((item) =>{
                return {
                    id: item.id,
                    shortUrl: item.shortUrl,
                    url: item.url,
                    visitCount: item.visitCount
                }
            })
        })






    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 
}

export async function getRanking(req, res){

    try{

        const ranking = await connection.query(`
            SELECT users.id, users.name, COUNT(*) as "linksCount", SUM(urls."visitCount") as "visitCount" FROM users LEFT JOIN urls ON urls."userId" = users.id GROUP BY users.id ORDER BY "visitCount" ASC LIMIT 10
        `)


        return res
            .send(ranking.rows)
            .status(200)

    } catch(error){
        console.log(error);
        return res.sendStatus(500);
    } 

}
