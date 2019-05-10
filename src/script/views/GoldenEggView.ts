import BaseView from "./BaseView";
import PlatformMgr from "../mgrCommon/PlatformMgr";

export default class GoldenEggView extends BaseView{
	private clickCount:number = 0;
	private progressNum:number;
	private bar;
	private hammerAnim:Laya.Animation;

	onAwake(){
		this.clickCount = 0;
		this.progressNum = 0;
		
		Laya.timer.frameLoop(25, this, ()=>{
			if(this!=null&&this!=undefined){
				this.progressNum -= 0.06;
				this.updataProgress();
			}
		});
		let anchor = this.owner.getChildByName("anchor") as Laya.Image;
		anchor.y = anchor.y + this.offset.y;
		this.okBtn = anchor.getChildByName("btnClick") as Laya.Image;

		this.closeBtn = this.owner.getChildByName("closeBtn") as Laya.Image;
		this.bar = this.owner.getChildByName("bar") as Laya.Image;
		this.hammerAnim = this.owner["hammerAnim"] as Laya.Animation;
	}

	public addEvent() {
		this.okBtn.on(Laya.Event.CLICK,this,this.btnClick);
		this.closeBtn.on(Laya.Event.CLICK,this,this.closeView);
		super.addEvent();
    }
    
    public removeEvent() {
		this.okBtn.off(Laya.Event.CLICK,this,this.btnClick);
		this.closeBtn.off(Laya.Event.CLICK,this,this.closeView);
        super.removeEvent();
    }

	openView(_d){
		super.openView(_d);
		PlatformMgr.callAPIMethodByProxy("loadBannerAdHome");
	}

	btnClick():void{
		this.clickCount++;
		if(this.clickCount>14){
			//弹出框
			this.close();
			return;
		}
		this.progressNum += 0.1;
		if(this.progressNum>=1){
			this.close();
			return;
		}	
		this.hammerAnim.play(0,false);
		this.updataProgress();
	}

	updataProgress():void{
		if(this.progressNum>=1){
			this.progressNum = 1;
		}else if(this.progressNum<=0.07){
			this.progressNum = 0.07;
		}
		this.bar.height = 375 * this.progressNum;
	}

	close():void{
		super.closeView();
		PlatformMgr.callAPIMethodByProxy("showBannerAdHome");
	}

}