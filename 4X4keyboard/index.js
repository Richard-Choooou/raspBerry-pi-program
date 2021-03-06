const Gpio = require('onoff').Gpio
const ROWS = [18, 23, 24, 25]
const COLS = [17, 27, 22, 19]

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
        while(this.ROWS_BTN.length > 0) {
            this.ROWS_BTN.shift().unexport();
        }

        while(this.COLS_BTN.length > 0) {
            this.COLS_BTN.shift().unexport();
        }
    }

    listenCol() {
        this.ROWS_PIN.forEach(pin => {
            let btn = new Gpio(pin, 'out')
            btn.writeSync(1)
            this.ROWS_BTN.push(btn)
        })

        this.COLS_PIN.forEach((pin, index) => {
            let btn = new Gpio(pin, 'in', 'both')
            
            btn.watch((err, value) => {
                if(err) {
                    throw err
                }
                if(value) {
                    console.log(`按下了第${index + 1}列`)
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
            let btn = new Gpio(pin, 'out')
            btn.writeSync(1)
            this.COLS_BTN.push(btn)
        })

        this.ROWS_PIN.forEach((pin, index) => {
            let btn = new Gpio(pin, 'in', 'both')
            btn.watch((err, value) => {
                if(err) {
                    throw err
                }
                if(value) {
                    console.log(`按下了第${index + 1}行`)
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
