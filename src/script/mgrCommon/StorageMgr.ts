import USER from "../model/USER";
import MyUtils from "../tools/MyUtils";

export default class StorageMgr extends Laya.Script {

    
    constructor() { super(); }
    
    static setStorage(_d) {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        wx.setStorage({
            key: _d.key,
            data: JSON.stringify(_d.val),
            success: _d.success,
            fail: _d.fail,
            complete: _d.complete
        });
    }

    static getStorage(_key): any {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        try {
            var value = wx.getStorageSync(_key);
            if (value) {
                return value
            }
        } catch (e) {
        }
    }

    public static saveSession(_s){
        StorageMgr.setStorage({key:"sessionId",val:_s});
    }

    public static getLocalVirbort(){
        return MyUtils.isNull(StorageMgr.getStorage("virbort"));
    }

    public static setLocalVirbort(str:string){
        StorageMgr.setStorage({
            ket:"virbort", 
            val:str
        });
    }

    public static getLocalSound(){
        return MyUtils.isNull(StorageMgr.getStorage("sound"));
    }

    public static setLocalSound(str:string){
        StorageMgr.setStorage({
            ket:"sound", 
            val:str
        });
    }

    

    public static saveUserData(){
        let _d = {
            sessionId:USER.sessionId,
            openId:USER.openId,
            score:USER.score,
            exp:USER.exp,
            level:USER.level,
        }
        StorageMgr.setStorage({key:"userData",val:_d});
    }

    public static getLocalUserData(){
        if(USER.isLogin){
            return;
        }
        let _d = StorageMgr.getStorage("userData");
        if(!MyUtils.isNull(_d)){
            _d = JSON.parse(_d);
            USER.sessionId = _d.sessionId;
            USER.openId = _d.openId;
            USER.score = _d.score;
            USER.exp = _d.exp;
            USER.level = _d.level;
        }
    }
}