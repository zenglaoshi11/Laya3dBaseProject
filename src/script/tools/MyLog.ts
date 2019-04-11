import ConfigData from "../models/ConfigData";

export default class MyLog {
   
    public static log(arg1?: any,arg2?:any) {
        if (ConfigData.isLog) {
            console.log(arg1,arg2);
        }
    }
}