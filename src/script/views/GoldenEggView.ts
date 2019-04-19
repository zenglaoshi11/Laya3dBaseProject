import BaseView from "./BaseView";
import PlatformMgr from "../mgrCommon/PlatformMgr";

export default class GoldenEggView extends BaseView{
	private clickCount:number = 0;
	private progressNum:number;
	private bar;
	private hammerAnim;

	onAwake(){
		this.clickCount = 0;
		this.progressNum = 0;
		
		Laya.timer.frameLoop(25, this, ()=>{
			if(this!=null&&this!=undefined){
				this.progressNum -= 0.06;
				this.updataProgress();
			}
		});
		
		let anchorS = this.owner.getChildByName("anchorS") as Laya.Image;
		let offsetY:number = 0;
		if(PlatformMgr.ptAPI)
			offsetY = PlatformMgr.ptAPI.getOffsetOpenDomain();
		anchorS.y = anchorS.y + offsetY;
		this.okBtn = anchorS.getChildByName("okBtn") as Laya.Image;

		this.closeBtn = this.owner.getChildByName("closeBtn") as Laya.Image;
		this.bar = this.owner.getChildByName("bar") as Laya.Image;
		this.hammerAnim = this.owner.getChildByName("img_hammer") as Laya.Image;
	}

	public addEvent() {
		this.okBtn.on(Laya.Event.CLICK,this,this.btnClick);
		this.closeBtn.on(Laya.Event.CLICK,this,this.closeView);
	}

	openView(_d){
		super.openView(_d);
		if(PlatformMgr.ptAdMgr)
			PlatformMgr.ptAdMgr.loadBannerAdHome();
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
		if(PlatformMgr.ptAdMgr)
			PlatformMgr.ptAdMgr.showBannerAdHome();
	}

}