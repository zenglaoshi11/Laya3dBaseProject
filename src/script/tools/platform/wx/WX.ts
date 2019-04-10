import MyPlatform from "../MyPlatform";
import MyUtils from "../../MyUtils";
import USER from "../../../models/USER";
import HttpMgr from "../../../mgrCommon/HttpMgr";

export default class WXMgr extends MyPlatform {
    constructor() {
        super();
        this._launch = window["wx"].getLaunchOptionsSync();
    }

    doLaunch(){
        
    }
     /*
        success 成功回调
        fail 失败回调
    */
    doLogin(_data){
        window["wx"].login({
            success: (res) => {
                USER.code = res.code;
                //登录接口
                var launch = this.getLaunchData();
                var _d: any = {}
                _d.code = res.code;
                if(launch.query){
                    _d.inviteId = launch.query.invite_uid || '';
                    _d.channelId = launch.query.channel || "";
                    USER.fromAppid = launch.query.cur_share_id||"";
                }
                if(launch.referrerInfo){
                    USER.fromImgid = launch.referrerInfo.appId;
                }
                _d.success = _data.success;
                _d.fail = _data.fail;
                HttpMgr.instance.login(_d)
            },
        })
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
        if (Laya.Browser.onMiniGame) {
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
    }

}