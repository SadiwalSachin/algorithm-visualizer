import jwt from "jsonwebtoken"

export function getDataFromToken (request){
    try {

        console.log("token middleware runned");

        const token = request.cookies.get("token")?.value || ""

        console.log("token :",token);

        const decodedToken = jwt.verify(token,process.env.JWT_TOKEN_SECRET)

        console.log("decodedToken :",decodedToken);

        return decodedToken?.id

    } catch (error) {
        throw new Error(error.message)
    }
}