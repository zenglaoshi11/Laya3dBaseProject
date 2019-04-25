import MyUtils from "../tools/MyUtils";
import StorageMgr from "./StorageMgr";
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
                    if(res.sessionId){
                        UserData.sessionId = res.sessionId;
                    }
                    if(_d.success){
                        _d.success(res)
                    }
                }else{
                    // sessionId 过期
                    UserData.sessionId = "";
                    if(_d.fail){
                        _d.fail(res)
                    }
                }
                
            }
        })
    }

    //拿线上游戏的json配制
	getRemoteJson(_callback) {
		this._http.getRemoteJson(_callback);
	}

    //开关配制
    public getSystemConfig(): void {
        this._http.request({
			url: 'getSystemParamList.action', data: { nowVersion: ConfigData.version }, callback: (res) => {
				if (res.code == 0) {
					ConfigData.ctrlInfo = {
						// isConverge: res.isConverge, //聚合开关
						isShare: res.fuhuoControl,
						isWudian:res.positionControl, //误点开关
						shareInfo: res.shareInfo,
                        mainAdMy:res.noAd,//banner广告控制 //是否开启自己做的主页的广告条
                        adInfo: res.adInfo,
                        isGoldeggs:res.isGoldeggs,//砸金蛋开关
                        lateDelay:res.lateDelay,//误点延时
                    }
                    if(res.bannerAdIds){
                        ConfigData.bannerAdIds = res.bannerAdIds.split(",");
                    }
                    if(res.rewardedAdIds){
                        ConfigData.ctrlInfo.isVideo = true; //是否有视屏复活
                        ConfigData.rewardedAdIds = res.rewardedAdIds.split(",");
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
                    UserData.adCount = res.adCount;    
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