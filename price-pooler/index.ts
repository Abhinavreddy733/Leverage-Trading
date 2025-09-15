
import { WebSocket } from 'ws';
import redis from './redis'
import { WS_URL, assets } from './config';
import { latestPrices, decimals } from './prices';

const ws = new WebSocket(WS_URL);
let Id = 1;

ws.on('open', () => {
    console.log("Websocked connected to backend endpoint");

    assets.forEach((asset) => {
        const subscribeMessage = [
            {
                method: "SUBSCRIBE",
                params: [`bookTicker.${asset}`],
                id: Id++,
            },
        ]
        subscribeMessage.forEach((msg) => {
            ws.send(JSON.stringify(msg))
            // console.log("Message Sent"+ msg);
        })
        console.log("Subscribed to asset: ", asset);
    })
})

ws.on('message' , (msg) => {
    try {
        const parsedMsg = JSON.parse(msg.toString());

        if(parsedMsg?.data?.e === 'bookTicker') {
            const symbol = parsedMsg?.data.s;
            const ask = parseFloat(parsedMsg?.data?.a);
            const bid = parseFloat(parsedMsg?.data?.b);
            const price = (ask + bid ) / 2;

            latestPrices[symbol] = {
                price,
                decimal:decimals[symbol]!
            }
        }

    }catch (error) {
        console.log("Message parsing error: ", error);
    }
})

ws.on("error", (err) => {
    console.error("WS error:", err);
});

ws.on("close", (code, reason) => {
    console.error("WS closed:", code, reason.toString());
});

setInterval(async () => {
    const updates = Object.entries(latestPrices).map(([symbolName , data]) => ({
        asset : symbolName.split("_")[0],
        price : Math.round(data.price * 10 ** data.decimal),
        decimal : data.decimal
    }))

    if(updates.length > 0) {
        console.log(updates);
    }
    
} , 1000)