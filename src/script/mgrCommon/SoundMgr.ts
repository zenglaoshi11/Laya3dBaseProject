import ConfigData from "../models/ConfigData";

export default class SoundMgr {
    public static readonly instance: SoundMgr = new SoundMgr();
    private bgm:any;
    private constructor() {
    }

    public playSound(name: string): void {
        if (!ConfigData.isSound) {
            return;
        }
        let url = "res/sound/" + name + ".mp3";
        if (Laya.Browser.onMiniGame) {
            var sound = laya.utils.Pool.getItem(name);
            if (sound == null) {
                sound = wx.createInnerAudioContext();
                sound.src = "res/sound/" + name + ".mp3";
                sound.onEnded(() => {
                    laya.utils.Pool.recover(name, sound);
                    sound.offEnded();
                })
            }
            sound.play();
        } else {
            Laya.SoundManager.playSound(url, 1);
        }
    }

    public playBGM(){
        if (!ConfigData.isSound) {
            return;
        }
        let url = "res/sound/bgm.mp3";
        if (Laya.Browser.onMiniGame) {
            this.bgm = wx.createInnerAudioContext();
            this.bgm.src = url;
            this.bgm.loop = true;
            this.bgm.play();
        } else {
            Laya.SoundManager.playMusic(url, 0);
        }
    }

    public stopBGM(){
        let url = "res/sound/bgm.mp3";
        if (Laya.Browser.onMiniGame) {
            if(this.bgm){
                this.bgm.stop();
            }
        }else{
            Laya.SoundManager.stopMusic();
        }
    }



}