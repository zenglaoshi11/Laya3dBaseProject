import ConfigData from "../../models/ConfigData";
import SoundMgr from "../../mgrCommon/SoundMgr";
import GameMgr from "../../mgr3d/GameMgr";
import ViewMgr from "../../mgrCommon/ViewMgr";
import MainView from "../../views/MainView";
import MyUtils from "../../tools/MyUtils";

export default class WXLaunch extends Laya.Script {
    private toProcess: number = 1;
    private progress: number = 0;
    private proLabel: Laya.Label;
    private tipLable: Laya.Label;
    private pro: Laya.Image;
    private scene3dUrl:string = "LayaScene_Eatitup/Conventional/Eatitup.ls"

    getLaunchTipMsg() {
        let tips = [
            "按住屏幕舌头会伸长哦",
            "敲好玩，值得等待，呱~"
        ]
        return tips[MyUtils.random(0, tips.length - 1)];
    }

    onEnable(): void {
        if (Laya.Browser.onMiniGame) {
            var xhr: Laya.HttpRequest = new Laya.HttpRequest();
            xhr.once(Laya.Event.COMPLETE, this, (data)=>{
                if(data && typeof data != "string" && typeof data == "object"){
                    if(ConfigData.jsonVersion != data.vision){
                        xhr = new Laya.HttpRequest();
                        xhr.once(Laya.Event.COMPLETE, this, (res)=>{
                            if(res && typeof res != "string" && typeof res == "object"){
                                ConfigData.initConfigData(res,true);
                            }
                        });
                        xhr.send(data.path,null,"get","json",["Content-Type", "application/json"]);
                    }
                }
            });
            xhr.send(ConfigData.jsonVersionUrl,null,"get","json",["Content-Type", "application/json"]);
        }

        var group: Laya.Node = this.owner.getChildByName("progressGroup");
        this.pro = group.getChildByName("progress") as Laya.Image;
        this.proLabel = group.getChildByName("proLabel") as Laya.Label;
        this.tipLable = this.owner.getChildByName("tipBg").getChildByName("lbl_tip") as Laya.Label;
        this.tipLable.text = this.getLaunchTipMsg();
        this.loadRes();
    }

    private loadRes() {
        var resource: Array<any> = [
            { url: "res/atlas/rank.atlas", type: Laya.Loader.ATLAS },
            { url: "res/json/config.json", type: Laya.Loader.JSON },
            { url: "res/json/" + ConfigData.language + ".json", type: Laya.Loader.JSON },
        ];
        var self = this;
        if (Laya.Browser.onMiniGame) {
            var loadTask: any = window["wx"].loadSubpackage({
                name: 'res3d', // name 可以填 name 或者 root
                success: (res) => {
                    // 分包加载成功后通过 success 回调
                    var loadTask1: any = window["wx"].loadSubpackage({
                        name: 'res', // name 可以填 name 或者 root
                        success: (res) => {
                            // 分包加载成功后通过 success 回调
                            Laya.loader.load(resource, Laya.Handler.create(this, () => {
                                self.updateProgress(0.99);
                                this.loadResComplete()
                            }), Laya.Handler.create(this, (res) => {
                                self.updateProgress(0.6 + res * 0.4)
                            }));
                        },
                        fail: (res) => {
                            // 分包加载失败通过 fail 回调
                            this.loadRes();
                        }
                    });
                    loadTask1.onProgressUpdate(res => {
                        self.updateProgress(0.3 + res.progress * 0.003)
                    });
                },
                fail: (res) => {
                    // 分包加载失败通过 fail 回调
                    this.loadRes();
                }
            });

            loadTask.onProgressUpdate(res => {
                self.updateProgress(res.progress * 0.003)
            });
        } else {
            Laya.loader.load(resource, Laya.Handler.create(this, () => {
                self.updateProgress(0.99);
                this.loadResComplete()
            }), Laya.Handler.create(this, (res) => {
                self.updateProgress(res)
            }));
        }
    }

    private loadResComplete() {
        //本地游戏数据配置
        ConfigData.initConfigData(
            Laya.Loader.getRes("res/json/config.json"),
        );
        //语言文件
        ConfigData.languageData = Laya.Loader.getRes("res/json/" + ConfigData.language + ".json");
        Laya.Scene3D.load(this.scene3dUrl, Laya.Handler.create(this, this.On3DResLoadComplete));
        // this.On3DResLoadComplete();
    }

    private On3DResLoadComplete(scene?: Laya.Scene3D) {
        this.updateProgress(1);
        
        if (Laya.Browser.onMiniGame) { 
            // console.log("子域加载res/atlas/rank.atlas");
            Laya.MiniAdpter.sendAtlasToOpenDataContext("res/atlas/rank.atlas"); //使用接口将图集透传到子域
        }
        SoundMgr.instance.playBGM();

        scene.addComponent(GameMgr);
        Laya.stage.addChild(scene);
        Laya.Scene.open("MainScene.scene");
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
                Laya.loader.clearRes("res/atlas/loading.atlas");
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