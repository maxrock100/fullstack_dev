var zmq = require("zeromq")

interface Message {
    timestamp: number,
    roomDetails: any,
    vitals: any
}

class MessageFeed {
    messages: any[];
    constructor() {
        this.messages = [];
    }

    //it will initiate message subscription
    init = () => {
        this.subscribeMessages(this.handlePrimaryMessages, 20001);
        this.subscribeMessages(this.handleSecondaryMessages, 20002);
    }

    // it will subscribe to incoming message on giving ports
    subscribeMessages = (cb:any, port:number) => {
        this.parseMessage
        const sock = zmq.socket("sub");
        sock.connect(`tcp://127.0.0.1:${port}`);
        sock.subscribe("observationMessages");
    
        sock.on("message", (topic:string, msg:Buffer) => {
            cb(this.parseMessage(msg.toString()))
        });
    }

    // this method will push every message recieved from primary system A
    handlePrimaryMessages = (message:Message) => {
        this.messages.push(message)
    }
    // this method will filter and merge message recieved from secondary system B
    handleSecondaryMessages = (message:Message) => {
        //it is the time till message will wait to synchronize
        const defaultTimeOut = 800;

        if(!this.synchronizeMessages(message))
            setTimeout(()=>{
                this.synchronizeMessages(message)
            },defaultTimeOut);
        }

    // this will parse the recieved message
    parseMessage = (msg: string) => {
        const [systemName, timestamp, roomDetails, vitals] = (JSON.parse(msg))
        return {
            timestamp,
            roomDetails,
            vitals
        }
    }

    // it will take care of synchronize message from secondary system to primary system
    synchronizeMessages = (message:Message) => {
        const index = this.messages.findIndex((msg)=>{
            return msg.timestamp === message.timestamp
        })
        if(index !== -1){
            const existingMessage = this.messages[index];
            this.messages[index] = {...existingMessage,vitals:{...existingMessage.vitals,...message.vitals}}
            return true
        }
        return false;
    }
}

export const messageFeedClient = new MessageFeed()