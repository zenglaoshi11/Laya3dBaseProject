import MyUtils from "../tools/MyUtils";
import ConfigData from "../models/ConfigData";
import UserData from "../models/UserData";

export default class HttpUtils {
    public request(_d) {
        var meth = _d.meth || "post"
        var data = _d.data || {};
        var url = "";
        if (_d.url.indexOf("https://") > -1 ||
            _d.url.indexOf("http://") > -1) {
            url = _d.url;
        } else {
            url = ConfigData.serverUrl + _d.url;
        }
        var completeDel = (res) => {
            if (_d.callback) {
                // console.log("url:" + url +" res:" + JSON.stringify(res));
                _d.callback(res);
            }
        };
        var errorDel = (res) => {
            if (_d.fail)  {
                _d.fail(res);
            }
        };
        if(UserData.sessionId){
            data.sessionId = UserData.sessionId;
            // console.log("sessionId：" + UserData.sessionId);
        }
        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        xhr.once(Laya.Event.COMPLETE, this, completeDel);
        xhr.once(Laya.Event.ERROR, this, errorDel);
        xhr.send(url, JSON.stringify(data), meth, "json", ["Content-Type", "application/x-www-form-urlencoded"]);
    }

    public requestStatistics(_d) {
        var meth = _d.meth || "post"
        var data = _d.data || {};
        var url = "";
        if (_d.url.indexOf("https://") > -1 ||
            _d.url.indexOf("http://") > -1) {
            url = _d.url;
        } else {
            url = ConfigData.statisticsUrl + _d.url;
        }
        // var completeDel = (res) => {
        //     if (_d.callback) {
        //         // console.log("url:" + url +" res:" + JSON.stringify(res));
        //         _d.callback(res);
        //     }
        // };
        // var errorDel = (res) => {
        //     if (_d.fail)  {
        //         _d.fail(res);
        //     }
        // };
        if(UserData.sessionId){
            data.sessionId = UserData.sessionId;
            // console.log("sessionId：" + UserData.sessionId);
        }
        var xhr: Laya.HttpRequest = new Laya.HttpRequest();
        // xhr.once(Laya.Event.COMPLETE, this, completeDel);
        // xhr.once(Laya.Event.ERROR, this, errorDel);
        xhr.send(url, "param=" + JSON.stringify(data), meth, "json", ["Content-Type", "application/x-www-form-urlencoded"]);
    }
}