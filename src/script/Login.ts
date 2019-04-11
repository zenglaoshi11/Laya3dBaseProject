import ConfigData from "./models/ConfigData";
import HttpMgr from "./mgrCommon/HttpMgr";
import StorageMgr from "./mgrCommon/StorageMgr";
import StatisticsMgr from "./mgrCommon/StatisticsMgr";
import PlatformMgr from "./mgrCommon/PlatformMgr";
import UserData from "./models/UserData";
import EventMgr from "./mgrCommon/EventMgr";

export default class Login extends Laya.Script{
	login() {
		HttpMgr.instance.getSystemConfig();
		this.loginFun();
	}

	loginFun() {
		var self = this;
		if (ConfigData.releasePlatform) {
			PlatformMgr.ptAPI.doLogin({
				success:Laya.Handler.create(this,this.loginSuccess,null,true),
				fail:Laya.Handler.create(this,this.loginFun,null,true)
			});
		} else {
			var _d: any = {}
			_d.code = "123";
			_d.inviteId = '';
			_d.channelId = "";
			_d.success = this.loginSuccess;
			HttpMgr.instance.login(_d)
		}
	}

	loginSuccess(data) {
		if (data) {
			UserData.isLogin = true;
			UserData.userId = data.userId;
			UserData.nickName = data.nikename;
			UserData.avatarUrl = data.headImage;
			UserData.diamond = data.userMoney;
			UserData.channelId = data.channelId;
			UserData.level = data.level;
			UserData.score = data.score;
			UserData.openId = data.openid;
			UserData.isNew = data.isNewUser;
			UserData.exp = data.nowExp;
			//缓存用户信息到本地
			StorageMgr.saveUserData();
			//上传排行数据
			PlatformMgr.ptAPI.uploadRankDate({
				level: data.level || 0,
				score: data.score || 0,
			});
			//上传统计
			StatisticsMgr.instance.loginStatisticsPost();
		}
		// EventMgr.instance.emit("loginSuccess");
		this.destroy();
	}

}

