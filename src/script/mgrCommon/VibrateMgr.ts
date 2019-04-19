import ConfigData from "../models/ConfigData";
import PlatformMgr from "./PlatformMgr";

export default class VibrateMgr {
   
    
    vibrateShort(): void {
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.vibrateShort();
    }

    vibrateLong(): void {
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.vibrateLong();
    }
}