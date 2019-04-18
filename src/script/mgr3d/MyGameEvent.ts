import EventMgr from "../mgrCommon/EventMgr";

export default class MyGameEvent {
    private events = ["test"];

    constructor() { 
        for (let index = 0; index < this.events.length; index++) {
            EventMgr.instance.on(this.events[index],this,this[this.events[index]]);
        } 
     }
    
    private test(res){
        console.log(res)
    }

   
}