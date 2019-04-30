import ConfigData from "../models/ConfigData";

export default class MyUtils {

    public static isNull(obj: any): boolean {
        if (obj != 0 && (obj == null || obj == "" || obj == undefined)) {
            return true;
        }
        return false;
    }


    public static random(min, max) {
        var range = max - min;
        var rand = Math.random();
        var num = min + Math.round(rand * range); //四舍五入
        return num;
    }

    		/**
		 * 比较版本号，格式xx.xx.xx
		 * @param v1 当前版本号
		 * @param v2 目标版本号
        */
    public static compareVersion(v1, v2): number {
        v1 = v1.split('.')
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])

            if (num1 > num2) {
            return 1
            } else if (num1 < num2) {
            return -1
            }
        }

        return 0
    }

    //顶部按钮对齐，大体适配是ok的
    public static autoScreenSize(node: any[]) {
        if (!Laya.Browser.onMiniGame) {
            return
        }
        let info = ConfigData.systemInfo;
        let _y = 20;
        if (info.statusBarHeight == 20) { 
        }else if (info.statusBarHeight == 44) { //27
            _y += 70;
        }
        node.forEach(e => { // 20  
            e.y = _y + e.height/2;
        })
    }


}