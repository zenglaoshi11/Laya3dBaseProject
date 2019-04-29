import ConfigData from "../models/ConfigData";
import PlatformMgr from "./PlatformMgr";

export default class VibrateMgr {
   
    
    vibrateShort(): void {
        PlatformMgr.callAPIMethodByProxy("vibrateShort");
    }

    vibrateLong(): void {
        PlatformMgr.callAPIMethodByProxy("vibrateLong");
    }
}