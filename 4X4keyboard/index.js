const Gpio = require('onoff').Gpio
const ROWS = [11, 13, 15, 39]
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
            this.ROWS_BTN.push(new Gpio(pin, 'out'))
        })

        this.COLS_PIN.forEach((pin, index) => {
            let btn = new Gpio(pin, 'in')
            btn.watch((err, value) => {
                if(err) {
                    throw err
                }

                if(value) {
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
        console.log(key)
    }
}

keyborad = new KeyBorad()

process.on('SIGINT', () => {
    keyborad.init()
});