import ConfigData from "../../models/ConfigData";
import SoundMgr from "../../mgrCommon/SoundMgr";
import GameMgr from "../../mgr3d/GameMgr";
import ViewMgr from "../../mgrCommon/ViewMgr";
import MyUtils from "../../tools/MyUtils";
import EventMgr from "../../mgrCommon/EventMgr";
import PlatformMgr from "../../mgrCommon/PlatformMgr";

export default class AndroidLaunch extends Laya.Script {
    private toProcess: number = 1;
    private progress: number = 0;
    private proLabel: Laya.Label;
    private tipLable: Laya.Label;
    private pro: Laya.Image;
    private scene3dUrl:string = "res3d/Conventional/BaseScene.ls"

    onEnable(): void {
        (this.owner as Laya.View).height = Laya.stage.height;
        var group: Laya.Node = this.owner.getChildByName("progressGroup");
        this.pro = group.getChildByName("progress") as Laya.Image;
        this.proLabel = group.getChildByName("proLab") as Laya.Label;
        this.loadRes();
    }

    private loadRes() {
        var resource: Array<any> = [
            { url: "res/atlas/beyond.atlas", type: Laya.Loader.ATLAS },
            // { url: "res/atlas/collet.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/common.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/convergeAd.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/game.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/goldenEgg.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/guide.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/Hesucceeds.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/mainview.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/numberFonts.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/rank.atlas", type: Laya.Loader.ATLAS },
            { url: "res/atlas/Resurgence.atlas", type: Laya.Loader.ATLAS },
            { url: "res/json/config.json", type: Laya.Loader.JSON },
            { url: "res/language/" + ConfigData.language + ".json", type: Laya.Loader.JSON },
        ];
        var self = this;
        Laya.loader.load(resource, Laya.Handler.create(this, () => {
            self.updateProgress(0.99);
            this.loadResComplete()
        }), Laya.Handler.create(this, (res) => {
            self.updateProgress(res)
        }));
    }

    private loadResComplete() {
        
        //本地游戏数据配置
        ConfigData.initConfigData(
            Laya.Loader.getRes("res/json/config.json"),
        );
        //语言文件
        ConfigData.languageData = Laya.Loader.getRes("res/language/" + ConfigData.language + ".json");
        Laya.Scene3D.load(this.scene3dUrl, Laya.Handler.create(this, this.On3DResLoadComplete));
        // this.On3DResLoadComplete();
    }

    private On3DResLoadComplete(scene?: Laya.Scene3D) {
        this.updateProgress(1);
        
        SoundMgr.instance.playBGM();
        scene.addComponent(GameMgr);
        Laya.stage.addChildAt(scene,0);
        EventMgr.instance.emit("goHome");
    }

    /**
		 * 更新资源加载进度
		 */
    public updateProgress(progress): void {
        this.progress = progress;
        this.progress > this.toProcess ? this.toProcess : this.progress;
        //最高100%进度
        if (this.progress >= 1) {
            // Laya.Tween.clearAll(this.pro);
            this.proLabel.text = "游戏加载完毕，即将进入游戏..."
            this.pro.width = 500;
            Laya.timer.frameOnce(2, this, () => {
                this.owner.destroy();
                Laya.loader.clearRes("loading/loading.atlas");
                this.destroy();
            })

        } else {
            this.pro.width = 500 * this.progress;
            // Laya.Tween.clearAll(this.pro);
            // Laya.Tween.to(this.pro,{width:500 * this.progress},100,Laya.Ease.linearNone)
            //进度增加
            this.proLabel.text = "资源加载中..." + Math.floor(this.progress * 100) + "%";
        }
    }
}