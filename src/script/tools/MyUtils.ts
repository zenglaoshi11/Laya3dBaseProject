import CONFIG from "../model/CONFIG";
import EventMgr from "./EventMgr";
import USER from "../model/USER";
import HttpUtils from "./HttpUtils";
import TipView from "../views/TipView";
import ViewMgr from "../views/ViewMgr";


export default class MyUtils {

    public static offsetOpenDomain: Laya.Vector2 = new Laya.Vector2(0, 0);
    private static btns = [];

    public static isNull(obj: any): boolean {
        if (obj != 0 && (obj == null || obj == "" || obj == undefined)) {
            return true;
        }
        return false;
    }

    public static log(log: String) {
        if (CONFIG.isLog) {
            console.log(log);
        }
    }

    public static random(min, max) {
        var range = max - min;
        var rand = Math.random();
        var num = min + Math.round(rand * range); //四舍五入
        return num;
    }

    		/**
		 * 比较版本号，格式xx.xx.xx
		 * @param v1 当前版本号
		 * @param v2 目标版本号
        */
    public static CompareVersion(v1, v2): number {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
            return 1
            } else if (num1 < num2) {
            return -1
            }
        }

        return 0
    }
 
    //开始游戏统计接口
    public static startGameStatistics() {
        var _d: any = {
            channel: USER.channelId,
            action: "1008",
            my_appid: CONFIG.myAppid,
            openid: USER.openId,
        }
        MyUtils.logPost(_d);
    }

    //分享统计接口  类型: 0普通分享, 1分享复活, 2分享获取道具, 3分享获取抽奖次数
    public static shareStatistics(type: number) {
        var _d: any = {
            channel: USER.channelId,
            action: "1009",
            type: type,
            my_appid: CONFIG.myAppid,
            openid: USER.openId,
        }
        MyUtils.logPost(_d);
    }

    //点击视频统计接口
    public static ClickVideoStatistics(type: number) {
        var _d: any = {
            channel: USER.channelId,
            action: "1010",
            type: type,
            my_appid: CONFIG.myAppid,
            openid: USER.openId,
        }
        EventMgr.instance.emit("log-post", _d);
    }

    //视频统计接口
    public static videoAdStatistics(type: number) {
        var _d: any = {
            channel: USER.channelId,
            action: "1011",
            type: type,
            my_appid: CONFIG.myAppid,
            openid: USER.openId,
        }
        MyUtils.logPost(_d);
    }


    //数据统计接口
    public static logPost(data) {
        HttpUtils.http({
            statisticsUrl: true, url: 'https://log.zuancr.com/', data: data
        })
    }

    // public static autoScreenSize(node: any[]) {
	// 	if (!Laya.Browser.onMiniGame) {
	// 		return
	// 	}
	// 	let info = wx.getSystemInfoSync();
	// 	let Y = 60;
	// 	if (info.statusBarHeight < 20) { //18
	// 		Y += 10;
	// 	}
	// 	else if (info.statusBarHeight >= 30) { //44
	// 		Y += 60;
	// 	}
	// 	else if (info.statusBarHeight > 20 && info.statusBarHeight < 30) { //27
	// 		Y += 74;
	// 	}
	// 	node.forEach(e => { // 20  
	// 		e.y = Y;
	// 	})
	// }



    /**
     * 设置子域界面偏移，适配不同的屏幕界面
     */
    public static setOpenDomainOffset() {
        let offsetX = Laya.stage.width - 750;
        if (offsetX < 0) {
            offsetX = 0;
        }
        let offsetY = Laya.stage.height - 1334;
        if (offsetY < 0) {
            offsetY = 0;
        }
        this.offsetOpenDomain = new Laya.Vector2(offsetX, offsetY);
        MyUtils.log("width:" + Laya.stage.width + " height:" + Laya.stage.height + " offsetX:" + offsetX + " offsetY:" + offsetY);
    }

    public static share(_d, type: number) {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (_d.callback) {
            var shareData: any = {
                caller: _d.caller,
                callback: _d.callback,
                args: _d.args,
            }
            EventMgr.instance.emit("go-share", shareData);
        }
        if (!CONFIG.GetConfigData("shareInfo")) {
            return;
        }
        MyUtils.shareStatistics(type);
        var sd = JSON.parse(CONFIG.GetConfigData("shareInfo"));
        var rand_t = this.random(0, sd.length - 1);
        var share_title = sd[rand_t].title;
        var share_img = sd[rand_t].img;
        var query = "invite_uid=" + (USER.userId ? USER.userId : "");
        query += "&cur_share_id=" + sd[rand_t].id;
        query += "&avatarUrlGroup=" + (USER.avatarUrl ? USER.avatarUrl : "");
        query += "&nickNameGroup=" + (USER.nickName ? USER.nickName : "");
        query += "&channel=" + (USER.channelId ? USER.channelId : "");
        if (_d) {
            if (_d.id) {
                query = query + "&scene=" + _d.id;
            }
            if (_d.itemId) {
                query = query + "&itemId=" + _d.itemId;
            }
            if (_d.type) {
                query = query + "&type=" + _d.type;
            }
            if (_d.share_img) {
                share_img = _d.share_img;
                share_title = _d.share_title;
            }
            if (_d.share_title) {
                share_title = _d.share_title;
            }
        }
        window["wx"].shareAppMessage({
            title: share_title,
            imageUrl: share_img,
            query: query,
        });
    }

    public static createAuthorizationButton(_data, isHide?: boolean) {
        if (Laya.Browser.onMiniGame) {
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting && res.authSetting["scope.userInfo"]) {
                        MyUtils.log("已经授权");
                    } else {
                        let sWidth = Laya.stage.width;
                        let sHeight = Laya.stage.height;
                        let xb = (Laya.Browser.width / Laya.Browser.pixelRatio) / sWidth;
                        let yb = (Laya.Browser.height / Laya.Browser.pixelRatio) / sHeight;
                        let left = (_data.x - _data.width / 2) * xb;
                        let top = (_data.y + MyUtils.offsetOpenDomain.y - _data.height / 2) * yb;
                        let width = _data.width * xb;
                        let height = (_data.height) * yb;
                        // let backgroundColor = "#ffffff";
                        if (_data.isFull) {
                            left = 0;
                            top = (_data.y + MyUtils.offsetOpenDomain.y / 2) * yb;
                            width = width;
                            height = height;
                            // backgroundColor = "#ff0703";
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
                        if (MyUtils.btns) {
                            MyUtils.btns.push({ "button": button, "isFull": _data.isFull });
                        }
                        button.onTap((res) => {
                            if (res && res.userInfo) {
                                USER.nickName = res.userInfo.nickName;
                                USER.gender = res.userInfo.gender;
                                USER.avatarUrl = res.userInfo.avatarUrl;
                                let _d: any = {};
                                _d.nickname = USER.nickName;
                                _d.headimgurl = USER.avatarUrl;
                                _d.sex = USER.gender;
                                var _d1: any = {
                                    action: "1006",
                                    channel: USER.channelId,
                                    from_appid: USER.from_appid,
                                    from_imgid: USER.from_imgid,
                                    my_appid: CONFIG.myAppid,
                                    code: USER.code,
                                    openid: USER.openId,
                                    isnew: USER.isNew ? 1 : 0,
                                }
                                MyUtils.logPost(_d1);
                                HttpUtils.http({
                                    url: 'updateUserInfo.action', data: _d, callback: (res) => {
                                        MyUtils.log("updateUserInfo.action：" + JSON.stringify(res));
                                        HttpUtils.http({
                                            url: 'getUserInfo.action', meth: 'POST', data: {}, callback: (res) => {
                                                if (res.code == 0) {

                                                }
                                            }
                                        })
                                    }
                                });
                                if (MyUtils.btns) {
                                    MyUtils.btns.forEach(element => {
                                        if (element) {
                                            element.button.destroy();
                                        }
                                    });
                                }
                                MyUtils.btns = null;
                                button.destroy();
                                if (_data.successBack) {
                                    _data.successBack.method.call(_data.successBack.caller);
                                }


                            } else {
                                // if (MyUtils.btns) {
                                if (_data.isFull) {
                                    CONFIG.isAuthorization = true;
                                    MyUtils.btns.forEach(element => {
                                        if (element&&element.isFull) {
                                            element.button.destroy();
                                        }
                                    });
                                }
                                // MyUtils.btns.forEach(element => {
                                //     if (element&&element.isFull) {
                                //         element.button.destroy();
                                //     }
                                // });
                                // }
                                MyUtils.hideAuthorizationCheck(false);
                                if (_data.failBack) {
                                    _data.failBack.method.call(_data.failBack.caller);
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

    public static destoryAuthorization(){
        CONFIG.isAuthorization = true;
        if(MyUtils.btns){
            MyUtils.btns.forEach(element => {
                if (element) {
                    element.button.destroy();
                }
            });
        }
    }



    public static hideAuthorizationCheck(flag) {
        if (MyUtils.btns) {
            MyUtils.btns.forEach(element => {
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

    

    public static navigateToMiniProgram(_d) {
        if (!_d || !Laya.Browser.onMiniGame) {
            return;
        }
        window["wx"].navigateToMiniProgram({
            appId: _d.appid,
            path: _d.path,
            extraData: {
                foo: 'bar',
            },
            // envVersion: 'develop',
            success(res) {
                _d.action = "1017";
                MyUtils.logPost(_d);
                if (_d.callback) {
                    _d.callback("success");
                }
                _d.callback = null;
            }
        })
    }

    public static uploadRankDate(_data) {
        if (Laya.Browser.onMiniGame) {
            var d = [];
            if (!MyUtils.isNull(_data.level)) {
                d.push({ key: "level", value: _data.level + "" });
            }
            window["wx"].setUserCloudStorage({
                KVDataList: d,
                success: function (res) {
                    // console.log("上传数据到微信服务器:" + JSON.stringify(res));
                }
            });
        }
    }

    public static UpdateSelfScore(score) {
        if (Laya.Browser.onMiniGame) {
            Laya.Browser.window.wx.postMessage({ type: "upScore" ,data:score});
        }
    }


    public static autoScreenSize(node: any[]) {
        if (!Laya.Browser.onMiniGame) {
            return
        }
        let info = wx.getSystemInfoSync();
        let Y = 60;
        if (info.statusBarHeight < 20) { //18
            Y += 10;
        }
        else if (info.statusBarHeight >= 30) { //44
            Y += 60;
        }
        else if (info.statusBarHeight > 20 && info.statusBarHeight < 30) { //27
            Y += 74;
        }
        node.forEach(e => { // 20  
            e.y = Y;
        })
    }

    public static vibrateShort() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (CONFIG.isVirbort) {
            window["wx"].vibrateShort();
        }
    }

    public static vibrateLong() {
        if (!Laya.Browser.onMiniGame) {
            return;
        }
        if (CONFIG.isVirbort) {
            window["wx"].vibrateLong();
        }
    }


    public static menuShare() {
        let self = this;
		if (Laya.Browser.onMiniGame) {
			window["wx"].showShareMenu({ withShareTicket: true })
			window["wx"].onShareAppMessage(function () {
				var sd = JSON.parse(CONFIG.GetConfigData("shareInfo"));
                var rand_t = self.random(0, sd.length - 1);
                var share_title = sd[rand_t].title;
                var share_img = sd[rand_t].img;
                var query = "invite_uid=" + (USER.userId ? USER.userId : "");
                query += "&cur_share_id=" + sd[rand_t].id;
                query += "&avatarUrlGroup=" + (USER.avatarUrl ? USER.avatarUrl : "");
                query += "&nickNameGroup=" + (USER.nickName ? USER.nickName : "");
                query += "&channel=" + (USER.channelId ? USER.channelId : "");
				return {
					title: share_title,
					imageUrl: share_img,
					query: query,
				}
			});
		}
	}
}