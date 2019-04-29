import ConfigData from "./models/ConfigData";
import HttpMgr from "./mgrCommon/HttpMgr";
import StorageMgr from "./mgrCommon/StorageMgr";
import StatisticsMgr from "./mgrCommon/StatisticsMgr";
import PlatformMgr from "./mgrCommon/PlatformMgr";
import UserData from "./models/UserData";
import EventMgr from "./mgrCommon/EventMgr";

export default class Login extends Laya.Script{
	login() {
		HttpMgr.instance.getRemoteJson((res)=>{
			ConfigData.initConfigData(res,true);
		});
		this.loginFun();
	}
	

	loginFun() {
		var self = this;
		if (ConfigData.releasePlatform) {
			PlatformMgr.callAPIMethodByProxy("doLogin",{
				success:(_d)=>{
					self.loginSuccess(_d);
				},
				fail:(_d)=>{
					self.loginFun();
				}
			});
		} else {
			var _d: any = {}
			_d.code = "123";
			_d.inviteId = '';
			_d.channelId = "";
			_d.success = self.loginSuccess;
			HttpMgr.instance.login(_d)
		}
	}

	loginSuccess(data) {
		if (data) {
			UserData.isLogin = true;
			UserData.userId = data.userId;
			UserData.nickName = data.nikename;
			UserData.avatarUrl = data.headImage;
			UserData.diamond = data.userMoney || 0;
			UserData.channelId = data.channelId;
			UserData.level = data.level || 0;
			UserData.score = data.score || 0;
			UserData.openId = data.openid;
			UserData.isNew = data.isNewUser;
			UserData.exp = data.nowExp || 0;

			HttpMgr.instance.getSystemConfig();
			
			//缓存用户信息到本地
			StorageMgr.saveUserData();
			//上传排行数据
			PlatformMgr.callAPIMethodByProxy("uploadRankDate",{
				level: data.level || 0,
				score: data.score || 0,
			});
			//上传统计
			StatisticsMgr.instance.loginStatisticsPost();
		}
		// EventMgr.instance.emit("loginSuccess");
	}

}

