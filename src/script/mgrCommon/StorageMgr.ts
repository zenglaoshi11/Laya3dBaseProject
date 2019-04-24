import MyUtils from "../tools/MyUtils";
import UserData from "../models/UserData";

export default class StorageMgr {
    
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