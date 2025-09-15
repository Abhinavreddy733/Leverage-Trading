import { verifyToken } from  "./jwt";

export const authMiddleware = async (
    req:Request,
    handler: (req:Request) => Promise<Response>
 ): Promise<Response> => {
    const token = (req as any) ?.cookies?.authToken
    if(!token) {
        return new Response(JSON.stringify({ error:"No Token is found in Middleware" }) , {
            status : 401,
            headers: { "Content-Type": "application/json" },
        })
    }
    const email = await verifyToken(token);
    if(!email) {
        return new Response(JSON.stringify({ error : "Invalid/expired session" }) , {
            status:401,
            headers: { "Content-Type": "application/json" },
        })
    }
    (req as any).user = { email };
    return handler(req)
 }