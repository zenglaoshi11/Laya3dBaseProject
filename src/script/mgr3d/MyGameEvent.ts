import EventMgr from "../mgrCommon/EventMgr";
import StatisticsMgr from "../mgrCommon/StatisticsMgr";

export default class MyGameEvent {
    private events = ["gameStart"];

    constructor() { 
        for (let index = 0; index < this.events.length; index++) {
            EventMgr.instance.on(this.events[index],this,this[this.events[index]]);
        } 
     }
    
    private gameStart(res){
        StatisticsMgr.instance.startGameStatistics();
        console.log(res)
    }

   
}