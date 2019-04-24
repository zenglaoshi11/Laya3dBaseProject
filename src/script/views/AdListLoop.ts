import MyUtils from "../tools/MyUtils";
import UserData from "../models/UserData";
import PlatformMgr from "../mgrCommon/PlatformMgr";

/**
* name 
*/
enum Direction {
	LEFT = 0,
	RIGHT = 1,
}

export default class AdListLoop extends Laya.Script {
	public _cells: Array<any>;
	private _cellWidth: number;
	private _spaceX: number;
	private moveDirection: Direction;
	private _mouseDown: boolean;
	private _mouseX: number;
	private fristPosX: number;
	private endPosX: number;
	private startTime: number;
	private speedTime: number;

	private itemWidth:number;
	private _cellHeight:number;

	constructor() {
		super();
		this._cellWidth = 101;
		this._cellHeight = 128;
		this._spaceX = 20;
		this.speedTime = 500;
		this.itemWidth = 101;
	}

	init(_d){
		this._cellWidth = _d._cellWidth || 101;
		this._spaceX = _d._spaceX || 20;
		this.speedTime = _d.speedTime || 500;
		this._cellHeight = _d._cellHeight||128;
	}

	start(adInfos) {
		if(MyUtils.isNull(adInfos)){
			return;
		}
		let self = this;
		this.owner.removeChildren();
		this._cells = [];
		let isOffset = adInfos.length > 4 ? true : false;
		for (var i = 0; i < adInfos.length; i++) {
			var adinfo = adInfos[i];
			let image: Laya.Image = new Laya.Image();
			this.owner.addChild(image);
			if (isOffset) {
				image.pos((i - 1) * (this._cellWidth + this._spaceX), 0);
			} else {
				image.pos((i) * (this._cellWidth + this._spaceX), 0);
			}
			image.skin = adinfo.param;
			image.width = this._cellWidth;
			image.height = this._cellHeight;
			let index = i;		
			image.on(Laya.Event.MOUSE_DOWN, this, function () {
				self.startTime = Laya.timer.currTimer;
			});
			image.on(Laya.Event.MOUSE_UP, this, function () {
				if (Laya.timer.currTimer - self.startTime <= 200) {
					self.tiaozhuang(adInfos[index], 3);
				}
				self.startTime = Laya.timer.currTimer;
			});
			this._cells.push(image as Laya.Image);
		}
		this.fristPosX = (this._cells[0] as Laya.Image).x;
		this.endPosX = (this._cells[this._cells.length - 1] as Laya.Image).x;
		this.moveDirection = Direction.RIGHT;
		this._mouseDown = false;
		this.autoMove();
		this.owner.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
		this.owner.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
		this.owner.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		this.owner.on(Laya.Event.MOUSE_OUT, this, this.mouseUp);
	}



	public tiaozhuang(adInfo, positionIdx) {
		var _d: any = {
			my_uuid: positionIdx,
			to_appid: adInfo.appid,
			appid : adInfo.appid,
			toLinks : adInfo.toLinks,
		};
		if(PlatformMgr.ptAPI)
			PlatformMgr.ptAPI.navigateToMiniProgram(_d);
	}


	autoMove() {
		if (this._cells.length <= 4) {
			return;
		}
		Laya.timer.clearAll(this);
		Laya.timer.loop(10, this, function () {
			this.move();
		});
	}

	move() {
		let index = 0;
		let self = this;

		let distance = -(this._cells[0].x - this.fristPosX);
		let timer = Math.abs(this.speedTime / (this._cellWidth + this._spaceX) * distance);

		for (var i = 0; i < this._cells.length; i++) {
			let cell: Laya.Image = this._cells[i] as Laya.Image;
			cell.pos(cell.x - 0.5, 0);
		}
		if ((this._cells[this._cells.length - 1] as Laya.Image).x > this.endPosX) {
			this.endMoveToFrist();
		}
		if ((this._cells[0] as Laya.Image).x < this.fristPosX) {
			this.firstMoveToEnd();
		}
	}


	firstMoveToEnd() {
		let currEndCell = (this._cells[this._cells.length - 1] as Laya.Image);
		let cell = this._cells.shift() as Laya.Image;
		cell.pos(currEndCell.x + this._cellWidth + this._spaceX, currEndCell.y);
		this._cells.push(cell);
	}

	endMoveToFrist() {
		let currFristCell = (this._cells[0] as Laya.Image);
		let cell = this._cells.pop() as Laya.Image;
		let x = currFristCell.x - this._cellWidth - this._spaceX
		cell.pos(x, currFristCell.y);
		this._cells.unshift(cell);
	}

	mouseDown() {
		this._mouseDown = true;
		Laya.timer.clearAll(this);
		this._mouseX = this._mouseX = Laya.MouseManager.instance.mouseX;
		Laya.timer.clearAll(this);
		for (var i = 0; i < this._cells.length; i++) {
			let cell: Laya.Image = this._cells[i] as Laya.Image;
			Laya.Tween.clearAll(cell);
		}
	}

	mouseMove() {
		if (this._mouseDown) {
			var dis = Laya.MouseManager.instance.mouseX - this._mouseX;
			this._mouseX = Laya.MouseManager.instance.mouseX;
			//先移动
			for (var j = 0; j < this._cells.length; j++) {
				let cell: Laya.Image = this._cells[j] as Laya.Image;
				cell.pos(cell.x + dis, cell.y);
			}
			if ((this._cells[this._cells.length - 1] as Laya.Image).x > this.endPosX) {
				this.endMoveToFrist();
			}
			if ((this._cells[0] as Laya.Image).x < this.fristPosX) {
				this.firstMoveToEnd();
			}
		}
	}

	mouseUp(event: Event) {
		this._mouseDown = false;
		this.autoMove();
	}

}