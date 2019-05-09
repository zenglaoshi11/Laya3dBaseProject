import UserData from "../../models/UserData";
import HttpMgr from "../../mgrCommon/HttpMgr";
import MyUtils from "../../tools/MyUtils";
import ConfigData from "../../models/ConfigData";
import EventMgr from "../../mgrCommon/EventMgr";
import StatisticsMgr from "../../mgrCommon/StatisticsMgr";
import MyLog from "../../tools/MyLog";
import SoundMgr from "../../mgrCommon/SoundMgr";
import ViewMgr from "../../mgrCommon/ViewMgr";
import WXSubDomain from "./WXSubDomain";

export default class WXAPI {
    public _launch:any = {};
    private btns = [];
    private offsetOpenDomain: Laya.Vector2;
    private stime = 0;
    private shareBackArgs = {};
    private shareBack;

    private bannerHome: any;
    private bannerOther: any;
    private bannerClassicEnd: any;

    private bannerHomeIsHide:boolean = true;
    private bannerOtherIsHide:boolean = true;
    private bannerClassicEndIsHide:boolean = true;


    private isInited = false;
    private rewardedVideoAd: any;
    private hasAd: boolean = false;

    private myCaller: any;
    private callBackSuc: Function;
    private callBackFail: Function;
    private callBackErro:Function;

    public videoPlayedTimes: number;


    private preBannerTimeHome: any;
    private preBannerTimeOther: any;
    private preBannerTimeClassicEnd: any;

    private _type:number;//看视屏，目标类型 SHARE_VIDEO_TYPE 0普通, 1复活, 2获取道具

    constructor() {
        this._launch = window["wx"].getLaunchOptionsSync();
        
        EventMgr.instance.onOnceEvent("getSystemParamListBack",this,()=>{
            this.showShareMenu();
        });
        // this.setOpenDomainOffset();

        window["wx"].onShow((res) => {
            var shareTicket = res.shareTicket;
            var query = res.query || {};
            if (shareTicket != undefined && query.avatarUrlGroup
                && query.nickNameGroup) {
                //在这做群排行的弹框
            } else {
                //分享回调
                var _d: any = this.shareBackArgs || {};
                let self = this;
                let time = Laya.Browser.now() - this.stime;
                if (Laya.Browser.now() - this.stime > 2000) {
                    _d.success = true;
                    if (this.shareBack && this.myCaller) {
                        this.shareBack.call(this.myCaller, _d);
                    }
                    this.shareBack = null;
                } else {
                    _d.success = false;
                    if (this.shareBack && this.myCaller) {
                        this.shareBack.call(this.myCaller, _d);
                    }
                    this.shareBack = null;
                }
            }
            //播放音乐 切到后台背景音乐消失需要重新播放
            SoundMgr.instance.playBGM();

            //聚合广告页面
            //控制结束页面的分享，不显示聚合广告页面
            let notShowAd = false;
            if(this.shareBackArgs){
                notShowAd = this.shareBackArgs["notShowAd"];
            }
            Laya.timer.frameOnce(1,this,()=>{
                //只在结束界面显示聚合广告页面
                let gameOverLevel = ViewMgr.instance.getView("GameOverLevel.scene");
                let gameOverEndless = ViewMgr.instance.getView("GameOverEndless.scene");
                let convergeAd = ViewMgr.instance.getView("ConvergeAd.scene");
                if (!notShowAd && (gameOverLevel || gameOverEndless) && !convergeAd) {
                    ViewMgr.instance.openView({
                        viewName: "ConvergeAd.scene",
                        closeAll: false,
                    });
                }
            })
            this.shareBackArgs = {};
        })
        window["wx"].onHide(() => {
            this.stime = Laya.Browser.now();
        });
        this.init();
    }

    public init() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (ConfigData.systemInfo.SDKVersion && MyUtils.compareVersion(ConfigData.systemInfo.SDKVersion, "2.0.4") >= 0) {
            this.isInited = true;
            this.initVedioCom();
        }
        this.preBannerTimeHome = Laya.timer.currTimer;
        this.preBannerTimeOther = Laya.timer.currTimer;
        this.preBannerTimeClassicEnd = Laya.timer.currTimer;
    }


    onGoShare(res) {
        this.myCaller = res.caller;
        this.shareBack = res.callback;
        this.shareBackArgs = res.args || {};
    }
     /*
        success 成功回调
        fail 失败回调
    */
   public doLogin(_data){
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        window["wx"].login({
            success: (res) => {
                UserData.code = res.code;
                //登录接口
                var launch = this.getLaunchData();
                var _d: any = {}
                _d.code = res.code;
                if(launch.query){
                    _d.inviteId = launch.query.invite_uid || '';
                    _d.channelId = launch.query.channel || "";
                    UserData.fromAppid = launch.query.cur_share_id||"";
                }
                if(launch.referrerInfo){
                    UserData.fromImgid = launch.referrerInfo.appId;
                }
                _d.success = _data.success;
                _d.fail = _data.fail;
                HttpMgr.instance.login(_d)
            },
            fail(res){
                //可以偿试重试，不重试一样游戏可以玩，只是数据没办法提交也属于正常流程
            }
        })
    }

    getOffsetOpenDomain():any{
        return this.offsetOpenDomain;
    }

    getLaunchData():any{
        return this._launch;
    }

    getQuery():any{
        return this._launch.query;
    }

    getReferrerInfo(){
        return this._launch.referrerInfo;
    }


    public  uploadRankDate(_data) {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        var d = [];
        if (!MyUtils.isNull(_data.level)) {
            d.push({ key: "level", value: _data.level + "" });
        }
        if (!MyUtils.isNull(_data.score)) {
            d.push({ key: "score", value: _data.score + "" });
        }
        window["wx"].setUserCloudStorage({
            KVDataList: d,
            success: function (res) {
                // console.log("上传数据到微信服务器:" + JSON.stringify(res));
            }
        });
    }

    public showShareMenu() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        window["wx"].showShareMenu({ withShareTicket: true });
        
        let shareInfo = this.createShareInfo();
        window["wx"].onShareAppMessage(function () {
            return shareInfo;
        });
    }

    private createShareInfo(_d?:any):any{
        var sd = JSON.parse(ConfigData.getConfigData("shareInfo"));
        if(!sd){return null}
        var rand_t = MyUtils.random(0, sd.length - 1);
        var title = sd[rand_t].title;
        var imageUrl = sd[rand_t].img;
        var query = "invite_uid=" + (UserData.userId ? UserData.userId : "");
        query += "&cur_share_id=" + sd[rand_t].id;
        //需要做群排行时打开，用于显示群排行的挑战对手
        // query += "&avatarUrlGroup=" + (UserData.avatarUrl ? UserData.avatarUrl : "");
        // query += "&nickNameGroup=" + (UserData.nickName ? UserData.nickName : "");
        query += "&channel=" + (UserData.channelId ? UserData.channelId : "");
        if (_d) {
            if (_d.id) {
                query += "&scene=" + _d.id;
            }
            if (_d.itemId) {
                query += "&itemId=" + _d.itemId;
            }
            if (_d.type) {
                query += "&type=" + _d.type;
            }
            if (_d.share_title) {
                title = _d.share_title;
            }
            if (_d.share_img) {
                imageUrl = _d.share_img;
            }
        }

        return {
            title: title,
            imageUrl: imageUrl,
            query: query,
        } 
    }
    
    public shareAppMessage(_d) {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (_d.callback) {
            this.onGoShare(_d);
        }
        if (!ConfigData.getConfigData("shareInfo")) {
            return;
        }
        StatisticsMgr.instance.shareStatistics(_d.type);
        let shareInfo = this.createShareInfo(_d);
        window["wx"].shareAppMessage(shareInfo);
    }

    public navigateToMiniProgram(_d) {
        if (!_d || !_d.to_appid || !Laya.Browser.onMiniGame) {
            return;
        }
        this.shareBackArgs["notShowAd"] = _d.notShowAd;
        StatisticsMgr.instance.navigateToMiniProgramStatistics(_d);
        window["wx"].navigateToMiniProgram({
            appId: _d.to_appid,
            path: _d.path,
            extraData: {
                foo: 'bar',
            },
            // envVersion: 'develop',
            complete:(res)=> {
                if(_d.complete){
                    _d.complete();
                }
                _d.complete = null;
            },
            fail:(res)=> {
                window["wx"].showToast({title:"跳转失败"});
                if(_d.fail){
                    _d.fail();
                }
                _d.fail = null;
            },
            success:(res)=> {
                StatisticsMgr.instance.navigateToMiniProgramBackStatistics(_d);
                if (_d.callback) {
                    _d.callback("success");
                }
                _d.callback = null;
            }
        })
    }

     /**
     * 设置子域界面偏移，适配不同的屏幕界面
     */
    public setOpenDomainOffset() {
        let offsetX = Laya.stage.width - 750;
        if (offsetX < 0) {
            offsetX = 0;
        }
        let offsetY = Laya.stage.height - 1334;
        if (offsetY < 0) {
            offsetY = 0;
        }
        this.offsetOpenDomain = new Laya.Vector2(offsetX, offsetY);
    }

    public createAuthorizationButton(_data) {
        if (Laya.Browser.onMiniGame) {
            let self = this;
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting && res.authSetting["scope.userInfo"]) {
                        MyLog.log("已经授权");
                    } else {
                        let sWidth = Laya.stage.width;
                        let sHeight = Laya.stage.height;
                        let xb = (Laya.Browser.width / Laya.Browser.pixelRatio) / sWidth;
                        let yb = (Laya.Browser.height / Laya.Browser.pixelRatio) / sHeight;
                        let left = (_data.x - _data.width / 2) * xb;
                        let top = (_data.y + self.offsetOpenDomain.y - _data.height / 2) * yb;
                        let width = _data.width * xb;
                        let height = (_data.height) * yb;
                        let backgroundColor = "#ffffff";
                        if (_data.isFull) {
                            left = 0;
                            top = (_data.y + self.offsetOpenDomain.y / 2) * yb;
                            width = width;
                            height = height;
                            backgroundColor = "#ff0703";
                        }
                        let button = window["wx"].createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: left,
                                top: top,
                                width: width,
                                height: height,
                                // backgroundColor: backgroundColor,
                            },
                        });
                        if (self.btns) {
                            self.btns.push({ "button": button, "isFull": _data.isFull });
                        }
                        button.onTap((res) => {
                            if (res && res.userInfo) {
                                UserData.nickName = res.userInfo.nickName;
                                UserData.gender = res.userInfo.gender;
                                UserData.avatarUrl = res.userInfo.avatarUrl;
                                
                                StatisticsMgr.instance.authorStatistics();
                                HttpMgr.instance.updateUserInfo();

                                if (self.btns) {
                                    self.btns.forEach(element => {
                                        if (element) {
                                            element.button.destroy();
                                        }
                                    });
                                }
                                self.btns = null;
                                button.destroy();
                                if (_data.successBack) {
                                    _data.successBack();
                                }
                            } else {
                                self.destoryAuthorization();
                                if (_data.failBack) {
                                    _data.failBack();
                                }
                            }
                        });
                    }
                },
                fail: function () { },
                complete: function () { }
            })
        }
    }

    public destoryAuthorization(){
        if(!ConfigData.repeatAuthorization){ //如果不需要重复弹授权
            ConfigData.isCreateAuthorization = true;
            if(this.btns){
                this.btns.forEach(element => {
                    if (element) {
                        element.button.destroy();
                    }
                });
            }
        }else{
            this.setAuthorizationCheck(false);
        }
    }

    public setAuthorizationCheck(flag) {
        if (this.btns) {
            this.btns.forEach(element => {
                if (element) {
                    if (flag) {
                        element.button.show();
                    } else {
                        element.button.hide();
                    }
                }
            });
        }
    }

    public vibrateShort() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (ConfigData.isVirbort) {
            window["wx"].vibrateShort();
        }
    }

    public vibrateLong() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (ConfigData.isVirbort) {
            window["wx"].vibrateLong();
        }
    }

    public openCustomerServiceConversation(){
        window["wx"].openCustomerServiceConversation();
    }

    private cleanVideoCall(){
        this.myCaller = null;
        this.callBackSuc = null;
        this.callBackFail = null;
        this.callBackErro = null;
    }
                
    public initVedioCom() {
        let self = this;
        if (this.isInited) {
            this.rewardedVideoAd = window["wx"].createRewardedVideoAd({ 
                adUnitId: ConfigData.rewardedAdIds[MyUtils.random(0,ConfigData.rewardedAdIds.length - 1)]
            });
            if (this.rewardedVideoAd == undefined) {
                return;
            }
            this.rewardedVideoAd.onLoad(() => {
                self.hasAd = true;
            });
            this.rewardedVideoAd.onError(err => {
                self.hasAd = false;
                HttpMgr.instance.videoCallback();
                if(this.callBackErro){
                    this.callBackErro();
                    return;
                }
                if (self.callBackSuc != null) {
                    self.callBackSuc();
                }
                this.cleanVideoCall();
            });
            this.rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    StatisticsMgr.instance.videoPlayOverAdStatistics(this._type);
                    // 正常播放结束，可以下发游戏奖励
                    self.videoPlayedTimes += 1;
                    if (self.callBackSuc != null) {
                        self.callBackSuc();
                    }
                }else {
                    // 播放中途退出，不下发游戏奖励
                    if (self.callBackFail != null) {
                        self.callBackFail();
                    }
                }
                this.cleanVideoCall();
            });
        }
    }


    public showVideo(_d:any) {
        if (!this.isInited) {
            return;
        }
        let self = this;
        this._type = _d._type || 0;
        this.myCaller = _d.caller;
        this.callBackSuc = _d.callBackSuc;
        this.callBackFail = _d.callBackFail;
        this.callBackErro = _d.callBackErro;
        StatisticsMgr.instance.clickVideoStatistics(this._type);
        if (this.hasAd) {
            this.hasAd = false;
            this.rewardedVideoAd.show();
        }else {
            this.rewardedVideoAd.load()
                .then(() => {
                    self.rewardedVideoAd.show();
                    self.hasAd = false;
                })
        }
    }

    public loadBannerAdHome() {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.showBannerAdHome(true)
    }

    public showBannerAdHome(onlyLoad?:boolean) {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = Laya.stage.width / 2 - 140;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerHomeIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTimeHome > 30000){
            if(this.bannerHome){
                this.bannerHome.destroy();
                this.bannerHome = null;
            }
        }
        if (!this.bannerHome) {
            this.destroyBannerAdHome();
            this.bannerHome = window["wx"].createBannerAd({
                adUnitId: ConfigData.bannerAdIds[MyUtils.random(0,ConfigData.bannerAdIds.length - 1)],
                style: {
                    left: 0,
                    top: screenH - 100,
                    width: _width,
                }
            });
            this.bannerHome.onResize(r => {
                this.bannerHome.style.left = (screenW - this.bannerHome.style.realWidth) / 2;
                this.bannerHome.style.top = screenH - this.bannerHome.style.realHeight;
                if (screenH / screenW > 2) {
                    this.bannerHome.style.top = this.bannerHome.style.top - 10;
                }
            })
            this.bannerHome.onError((res) => {
                console.log("广告加载错误:", res);
            })

            // this.bannerHome.onLoad(()=>{
            //     if(this.bannerHomeIsHide){
            //         this.bannerHome.destroy();
            //         return;
            //     }
            //     this.bannerHome.show();
            // })
            this.preBannerTimeHome = Laya.timer.currTimer;
        }
        if(onlyLoad){
            return;
        }
        if (this.bannerHome != undefined) {
            this.bannerHome.show();
        }
    }

    public showBannerAdOtherFast() {
        if (!this.bannerOther) {
            this.showBannerAdOther();
        }else{
            this.bannerOther.show();
        }
    }

    public showBannerAdOther(onlyLoad?:boolean) {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = screenW;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerOtherIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTimeOther > 30000){
            if(this.bannerOther){
                this.bannerOther.destroy();
                this.bannerOther = null;
            }
        }   
        if (!this.bannerOther) {
            this.destroyBannerAdOther();
            this.bannerOther = window["wx"].createBannerAd({
                adUnitId: ConfigData.bannerAdIds[MyUtils.random(0,ConfigData.bannerAdIds.length - 1)],
                style: {
                    left: 0,
                    top: screenH - 100,
                    width: _width,
                }
            });

            this.bannerOther.onResize(r => {
                this.bannerOther.style.left = (screenW - this.bannerOther.style.realWidth) / 2;
                this.bannerOther.style.top = screenH - this.bannerOther.style.realHeight - 10;
                if (screenH / screenW > 2) {
                    this.bannerOther.style.top = this.bannerOther.style.top - 25;
                }
            })

            this.bannerOther.onError((res) => {
                console.log("广告加载错误:", res);
            })
            this.preBannerTimeOther = Laya.timer.currTimer;
        }
        if(onlyLoad){
            return;
        }
        if (this.bannerOther != undefined) {
            this.bannerOther.show();
        }
    }

    public showBannerAdClassicEndFast() {
        if (!this.bannerClassicEnd) {
            this.showBannerAdClassicEnd();
        }else{
            this.bannerClassicEnd.show();
        }
    }

    public showBannerAdClassicEnd(onlyLoad?:boolean) {
        if (!Laya.Browser.onMiniGame||!this.isInited) {
            return;
        }
        this.destoryAllBannerAd();
        let screenW = ConfigData.systemInfo.windowWidth;
        let _width = screenW;
        let screenH = ConfigData.systemInfo.windowHeight;
        this.bannerClassicEndIsHide = false;
        if(Laya.timer.currTimer - this.preBannerTimeOther > 30000){
            if(this.bannerClassicEnd){
                this.bannerClassicEnd.destroy();
                this.bannerClassicEnd = null;
            }
        }
        if (!this.bannerClassicEnd) {
            this.destroyBannerAdClassicEnd();
            this.bannerClassicEnd = window["wx"].createBannerAd({
                adUnitId: 'adunit-dcacf7fd6e654b4d',
                style: {
                    left: 0,
                    top: screenH - 100,
                    width: _width,
                }
            });
            this.bannerClassicEnd.onError((res) => {
                console.log("广告加载错误:", res);
            })

            this.bannerClassicEnd.onResize(r => {
                this.bannerClassicEnd.style.left = (screenW - this.bannerClassicEnd.style.realWidth) / 2;
                this.bannerClassicEnd.style.top = screenH - this.bannerClassicEnd.style.realHeight - 10;
                if (screenH / screenW > 2) {
                    this.bannerClassicEnd.style.top = this.bannerClassicEnd.style.top - 25;
                }
            })
            this.preBannerTimeOther = Laya.timer.currTimer;
        }
        if(onlyLoad){
            return;
        }
        if (this.bannerClassicEnd != undefined) {
            this.bannerClassicEnd.show();
        }
    }

    public destroyBannerAdHome() {
        this.bannerHomeIsHide = true;
        if (this.bannerHome) {
            this.preBannerTimeHome = 0;
            if(ConfigData.ctrlInfo.is_banner == 1){
                this.bannerHome.destroy();
                this.bannerHome = null;
            }else{
                this.bannerHome.hide();
            }
        }
    }

    public destroyBannerAdOther() {
        this.bannerOtherIsHide = true;
        if (this.bannerOther) {
            this.preBannerTimeOther = 0;
            if(ConfigData.ctrlInfo.is_banner == 1){
                this.bannerOther.destroy();
                this.bannerOther = null;
            }else{
                this.bannerOther.hide();
            }
        }
    }


    public destroyBannerAdClassicEnd() {
        this.bannerClassicEndIsHide = true;
        if (this.bannerClassicEnd) {
            this.preBannerTimeClassicEnd = 0;
            if(ConfigData.ctrlInfo.is_banner == 1){
                this.bannerClassicEnd.destroy();
                this.bannerClassicEnd = null;
            }else{
                this.bannerClassicEnd.hide();
            }
        }
    }

    public destoryAllBannerAd() {
        this.destroyBannerAdHome();
        this.destroyBannerAdOther();
        this.destroyBannerAdClassicEnd();
    }

}