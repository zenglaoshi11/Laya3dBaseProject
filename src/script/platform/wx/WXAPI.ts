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
    private caller = null;
    private shareBack;

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
                    if (this.shareBack && this.caller) {
                        this.shareBack.call(this.caller, _d);
                    }
                    this.shareBack = null;
                } else {
                    _d.success = false;
                    if (this.shareBack && this.caller) {
                        this.shareBack.call(this.caller, _d);
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
    }


    onGoShare(res) {
        this.caller = res.caller;
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
}