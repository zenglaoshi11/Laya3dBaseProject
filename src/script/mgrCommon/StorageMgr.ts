import MyUtils from "../tools/MyUtils";
import UserData from "../models/UserData";
import ConfigData from "../models/ConfigData";

export default class StorageMgr {
    
    static setStorage(_d) {
        
        let dataStr:string = JSON.stringify(_d.val);
        if(window["strEnc"]){
            dataStr = window["strEnc"](dataStr,ConfigData.encryptDESKey1,ConfigData.encryptDESKey2,ConfigData.encryptDESKey3);
        }
        if (!Laya.Browser.onMiniGame) {
            localStorage.setItem(_d.key,dataStr);
            return;
        }
        wx.setStorage({
            key: _d.key,
            data: dataStr,
            success: _d.success,
            fail: _d.fail,
            complete: _d.complete
        });
    }

    static getStorage(_key): any {
        var value = null;
        try {
            if (!Laya.Browser.onMiniGame) {
                value = localStorage.getItem(_key);
            }else{
                value = wx.getStorageSync(_key);
            }
            if(window["strDec"]){
                value = window["strDec"](value,ConfigData.encryptDESKey1,ConfigData.encryptDESKey2,ConfigData.encryptDESKey3);
            }
        } catch (e) {
        }
        return value;
    }

    public static getLocalVirbort():any{
        let virbort:any;
        if (!Laya.Browser.onMiniGame) {
            virbort = localStorage.getItem("virbort");
        }else{
            virbort = wx.getStorageSync("virbort");
        }
        if(virbort == "1"){
            return false;
        }
        return true;
    }

    public static setLocalVirbort(str){
        if (!Laya.Browser.onMiniGame) {
            localStorage.setItem("virbort",str);
            return;
        }
        wx.setStorage({
            key:"virbort", 
            success: null,
            fail: null,
            complete: null,
            data: str
        });
    }

    public static getLocalSound():any{
        let sound:any;
        if (!Laya.Browser.onMiniGame) {
            sound = localStorage.getItem("sound");
        }else{
            sound = wx.getStorageSync("sound");
        }
        if(sound == "1"){
            return false;
        }
        return true;
    }

    public static setLocalSound(str){
        if (!Laya.Browser.onMiniGame) {
            localStorage.setItem("sound",str);
            return;
        }
        wx.setStorage({
            key:"sound",
            success: null,
            fail: null,
            complete: null,
            data: str
        });
    }

    public static saveUserData(){
        let _d = {
            sessionId:UserData.sessionId,
            openId:UserData.openId,
            score:UserData.score,
            exp:UserData.exp,
            level:UserData.level,
        }
        StorageMgr.setStorage({key:"userData",val:_d});
    }

    public static getLocalUserData(){
        if(UserData.isLogin){
            return;
        }
        let _d = StorageMgr.getStorage("userData");
        if(!MyUtils.isNull(_d)){
            _d = JSON.parse(_d);
            UserData.sessionId = _d.sessionId;
            UserData.openId = _d.openId;
            UserData.score = _d.score || 0;
            UserData.exp = _d.exp;
            UserData.level = _d.level || 0;
        }
    }
}