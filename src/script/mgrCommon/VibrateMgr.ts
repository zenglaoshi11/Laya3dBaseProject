import ConfigData from "../models/ConfigData";
import PlatformMgr from "./PlatformMgr";

export default class VibrateMgr {
   
    
    vibrateShort(): void {
        PlatformMgr.ptAPI.vibrateShort();
    }

    vibrateLong(): void {
        PlatformMgr.ptAPI.vibrateLong();
    }
}