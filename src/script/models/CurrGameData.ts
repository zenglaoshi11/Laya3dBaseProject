import { SORTTYPE } from "./ConfigData";

//当前游戏的数据
export default class CurrGameData{
    
    public score:number = 0;//分数
    public sortType:SORTTYPE = SORTTYPE.ENDLESS; //游戏类型
    public reset() {
        this.score = 0;
    }
}