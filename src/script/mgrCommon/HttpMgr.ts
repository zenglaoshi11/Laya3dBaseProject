import MyUtils from "../tools/MyUtils";
import StorageMgr from "./StorageMgr";
import USER from "../models/USER";
import ConfigData from "../models/ConfigData";
import HttpUtils from "../tools/HttpUtils";
import UserData from "../models/UserData";
import EventMgr from "./EventMgr";

export default class HttpMgr {
    public static readonly instance: HttpMgr = new HttpMgr();
    private _http:HttpUtils = new HttpUtils();
    private constructor() {
    }
    //登陆
    public login(_d:any): void {
        this._http.request({
            url: 'userLogin.action', data: _d, callback: (res) => {
                if (res.code == 0) {
                    USER.sessionId = res.sessionId;
                    StorageMgr.saveSession(USER.sessionId);
                    if(_d.success){
                        _d.success(res)
                    }
                }else{
                    // sessionId 过期
                    StorageMgr.saveSession("");
                    USER.sessionId = "";
                    if(_d.fail){
                        _d.fail(res)
                    }
                }
                
            }
        })
    }

    //开关配制
    public getSystemConfig(): void {
        this._http.request({
			url: 'getSystemParamList.action', data: { nowVersion: ConfigData.version }, callback: (res) => {
				if (res.code == 0) {
					ConfigData.ctrlInfo = {
						isConverge: res.isConverge, //聚合开关
						isShare: res.isShare,
						isVideo: res.isVideo,
						isWudian:res.isWudian, //误点开关
						shareInfo: res.shareInfo,
						isBanner:res.is_banner,//banner广告控制
						adInfo: res.adInfo,
                    }
				}
                EventMgr.instance.emit("getSystemParamListBack");
			},fail:(res)=>{
                EventMgr.instance.emit("getSystemParamListBack");
            }
		});
    }

    public updateUserInfo(){
        this._http.request({
            url: 'updateUserInfo.action', data: {
                nickname:UserData.nickName,
                headimgurl:UserData.avatarUrl,
                sex:UserData.gender,
            }});
    }

    public statisticsPost(_d){
        this._http.requestStatistics(_d);
    }

    public videoErrorCallback(){
        this._http.request({
            url: 'videoCallback.action', callback: (res) => {
                if(res.code == 0){
                    USER.adCount = res.adCount;    
                }
        }});
    }

    public getWorldRank(_d){
        this._http.request({
            url: 'getWorldRank.action',data: { page: 1, type: 1 }, callback: (res) => {
                if(res.code == 0){
                    if(_d.success){
                        _d.success(res)
                    }   
                }
        }});
    }
}