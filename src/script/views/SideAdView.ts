import ConfigData from "../models/ConfigData";
import UserData from "../models/UserData";
import PlatformMgr from "../mgrCommon/PlatformMgr";
import StatisticsMgr from "../mgrCommon/StatisticsMgr";

export default class SideAdView extends Laya.Script {
    private isClick = false;
    private toLinks = "";
    private toAppId = "";
    private thePosition = 1;//推广位置
    private nowidx = 0;
    private maxdix = 0;
    private isAnim = true;
    private isChange = false;

    private img:Laya.Image;

    constructor() { super(); }
    onAwake() {
        this.owner.on(Laya.Event.CLICK, this, this.jumpOtherGame);
    }

    public start(isAnim: boolean, isChange: boolean, thePosition: number) {
        Laya.Tween.clearAll(this);
        let ads = ConfigData.getADData(thePosition);
        if (!ads || ads.length <= 0) {
            (this.owner as Laya.Image).visible = false;
            return;
        }
        (this.owner as Laya.Image).rotation = 0;
        (this.owner as Laya.Image).scale(1, 1);
        this.isAnim = isAnim;
        this.isChange = isChange;
        this.thePosition = thePosition;
        this.nowidx = 0;
        this.maxdix = ads.length - 1;
        this.randomAD();
        if (this.isAnim) {
            this.adAnim();
        }
        Laya.timer.clearAll(this);
        this.startAnim();
    }

    public startAnim() {
        let adInfos = ConfigData.getADData(this.thePosition);
        Laya.timer.loop(10000, this, () => {
            if (adInfos != null) { //这个位置的广告大于一 才会去切换  也就是说才会有动画
                if (adInfos.length > 1) {
                    if (this.isChange) {
                        this.changeAD();
                    }else {
                        this.randomAD();
                    }
                }else {
                    this.randomAD();
                }
            }
            else {
                if (this.isChange) {
                    this.changeAD();
                }else {
                    this.randomAD();
                }
            }
        });
    }

    randomAD() {
        let ads = ConfigData.getADData(this.thePosition);
        if (ads) {
            var leng = ads.length;
            (this.owner as Laya.Image).skin = ads[this.nowidx].param;
            this.toAppId = ads[this.nowidx].appid;
            this.toLinks = ads[this.nowidx].toLinks;
            this.nowidx = this.nowidx + 1;
            if (this.nowidx > this.maxdix) {
                this.nowidx = 0;
            }
        }
    }

    public changeAD() {
        let img = this.owner as Laya.Image;
        img.scale(1,1);
        Laya.Tween.to(img, { scaleX: 0, scaleY: 0 }, 300, null, Laya.Handler.create(this, () => {
            this.randomAD();
            Laya.Tween.to(img, { scaleX: 0, scaleY: 0 }, 100, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(img, { scaleX: 1, scaleY: 1 }, 300, null, Laya.Handler.create(this, () => {
                    // this.adAnim();
                }));
            }));
        }));
    }

    public adAnim(): void {
        let img = this.owner as Laya.Image;
        img.rotation = 0;
        Laya.Tween.to(img, { rotation: 10 }, 300, null, Laya.Handler.create(this, () => {
            Laya.Tween.to(img, { rotation: 0 }, 300, null, Laya.Handler.create(this, () => {
                Laya.Tween.to(img, { rotation: -10 }, 300, null, Laya.Handler.create(this, () => {
                    Laya.Tween.to(img, { rotation: 0 }, 300, null, Laya.Handler.create(this, () => {
                        this.adAnim();
                    }));
                }));
            }));
        }));

    }

    jumpOtherGame() {
        if (this.isClick) {
            return;
        }
        this.isClick = true;
        var _d: any = {
            my_uuid: this.thePosition,
            to_appid: this.toAppId,

            path:this.toLinks,
            appId:this.toAppId,
        };
        if(PlatformMgr.ptAPI)
            PlatformMgr.ptAPI.navigateToMiniProgram(_d);
        this.clickedAd();
    }

    clickedAd(){
        Laya.timer.clearAll(this);
        Laya.Tween.clearAll(this.owner);
        Laya.timer.once(500,this,()=>{
            this.isClick = false;
        })
        this.adAnim();
        this.changeAD();
    }
}