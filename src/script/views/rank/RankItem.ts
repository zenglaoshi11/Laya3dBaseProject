import MyUtils from "../../tools/MyUtils";

export default class RankItem extends Laya.Box {
    private bgImg: Laya.Image;
    private rankImg: Laya.Image;
    private rankLbl: Laya.Label;

    private avatarImg: Laya.Image;
    private nameLbl: Laya.Label;

    private scoreIconImg: Laya.Image;
    private score: Laya.Label;

    constructor() { 
        super(); 
        this.bgImg = this.getChildByName("imgBg") as Laya.Image;
        this.rankImg = this.getChildByName("rankImg") as Laya.Image;
        this.rankLbl = this.getChildByName("rankLbl") as Laya.Label;

        this.avatarImg = this.getChildByName("avatarImg") as Laya.Image;
        this.nameLbl = this.getChildByName("lblName") as Laya.Label;

        this.scoreIconImg = this.getChildByName("scoreIconImg") as Laya.Image;
        this.score = this.getChildByName("score") as Laya.Label;
    }

    updateItem(itemData){
        this.rankImg.active = false;
        this.rankLbl.text = itemData.index;
        switch(itemData.index){
            case 1:
            case 2:
            case 3:
                this.rankLbl.text = "";
                this.rankImg.skin = "rank/"+ itemData.index +".png";
                this.rankImg.active = true;
            break;
        }

        if (!MyUtils.isNull(itemData.headImage)&&itemData.headImage!="youke") {
            let avatarUrl = itemData.headImage.replace("/132", "/46");
            this.avatarImg.skin = avatarUrl;
        }
        let name = itemData.user_nickname.length > 6 ? itemData.user_nickname.substr(0, 8) : itemData.user_nickname;
        this.nameLbl.text = name!=""?name:"神秘玩家";

        this.score.text = itemData.score;
    }

}