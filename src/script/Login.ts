import USER from "./models/USER";
import CONFIG from "./models/CONFIG";
import HttpMgr from "./mgrCommon/HttpMgr";
import StorageMgr from "./mgrCommon/StorageMgr";
import StatisticsMgr from "./mgrCommon/StatisticsMgr";
import PlatformMgr from "./mgrCommon/PlatformMgr";

export default class Login {
	login() {
		HttpMgr.instance.getSystemConfig();
		this.loginFun();
	}

	loginFun() {
		var self = this;
		if (CONFIG.releasePlatform) {
			PlatformMgr.instance.doLogin({
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
			USER.isLogin = true;
			USER.userId = data.userId;
			USER.nickName = data.nikename;
			USER.avatarUrl = data.headImage;
			USER.diamond = data.userMoney;
			USER.channelId = data.channelId;
			USER.level = data.level;
			USER.score = data.score;
			USER.openId = data.openid;
			USER.isNew = data.isNewUser;
			USER.exp = data.nowExp;
			//缓存用户信息到本地
			StorageMgr.saveUserData();
			//上传排行数据
			PlatformMgr.instance.uploadRankDate({
				level: data.level || 0,
				score: data.score || 0,
			});
			//上传统计
			StatisticsMgr.instance.loginStatisticsPost();
		}
	}

}
new Login().login();

