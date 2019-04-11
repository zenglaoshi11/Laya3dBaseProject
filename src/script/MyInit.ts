import PlatformMgr from "./mgrCommon/PlatformMgr";
import ConfigData from "./models/ConfigData";
import StorageMgr from "./mgrCommon/StorageMgr";
import WXAdMgr from "./platform/wx/WXADMgr";
import Login from "./Login";

export default class MyInit {
    static init(){
        ConfigData.initLocal();
        StorageMgr.getLocalUserData();
        PlatformMgr.initPlatform();

        
        new Login().login();
    }
}