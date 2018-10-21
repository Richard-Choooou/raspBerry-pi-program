const Gpio = require('onoff').Gpio
const ROWS = [11, 13, 15, 31]
const COLS = [12, 16, 18, 22]

class KeyBorad {
    constructor() {
        this.ROWS_PIN = ROWS
        this.COLS_PIN = COLS
        this.ROWS_BTN = []
        this.COLS_BTN = []

        this.points = [
            [1, 2, 3, 'A'],
            [4, 5, 6, 'B'],
            [7, 8, 9, 'C'],
            ['*', 0, '#', 'D']
        ]

        this.pressedColKey = -1
        this.pressedRowKey = -1
        console.log('程序初始化')
        this.init()
        this.listenCol()
    }

    init() {
        console.log('初始化按键')
        while(this.ROWS_BTN.length > 0) {
            this.ROWS_BTN.shift().unexport();
        }

        while(this.COLS_BTN.length > 0) {
            this.COLS_BTN.shift().unexport();
        }
    }

    listenCol() {
        this.ROWS_PIN.forEach(pin => {
            console.log('初始化按键', pin)
            this.ROWS_BTN.push(new Gpio(pin, 'out'))
        })

        this.COLS_PIN.forEach((pin, index) => {
            console.log('初始化按键', pin)
            let btn = new Gpio(pin, 'in')
            btn.watch((err, value) => {
                if(err) {
                    throw err
                }
                console.log(`第${index}列被按下了`)
                if(value) {
                    // console.log(`第${index}列被按下了`)
                    this.pressedColKey = index
                    this.pressedRowKey = -1
                    this.init()
                    this.listenRow()
                }
            })
            this.COLS_BTN.push(btn)
        })
    }

    listenRow() {
        this.COLS_PIN.forEach(pin => {
            this.COLS_BTN.push(new Gpio(pin, 'out'))
        })

        this.ROWS_PIN.forEach((pin, index) => {
            let btn = new Gpio(pin, 'in')
            btn.watch((err, value) => {
                if(err) {
                    throw err
                }
                console.log(`第${index}行被按下了`)
                if(value) {
                    this.pressedRowKey = index
                    this.systemOut()
                } else {
                    this.init()
                    this.pressedColKey = -1
                    this.pressedRowKey = -1
                    this.listenCol()
                }
            })
            this.ROWS_BTN.push(btn)
        })
    }

    systemOut() {
        let key = this.points[this.pressedRowKey][this.pressedColKey]
        console.log('按下了', key)
    }
}

keyborad = new KeyBorad()

process.on('SIGINT', () => {
    console.log('程序退出')
    keyborad.init()
});