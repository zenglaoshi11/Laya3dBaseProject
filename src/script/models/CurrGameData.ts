//当前游戏的数据
export default class CurrGameData{
    
    public score:number = 0;//分数
 
    public reset() {
        this.score = 0;
    }
}