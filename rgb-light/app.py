GPIO.cleanup()                                                                                                                 import time

blue = 11           #蓝灯信号输出引脚
red = 22            #红灯信号输出引脚
green = 16          #绿灯信号输出引脚
beep = 37           #嗡鸣器输出引脚

GPIO.setmode(GPIO.BOARD)
GPIO.setup(blue, GPIO.OUT)
GPIO.setup(green, GPIO.OUT)
GPIO.setup(red, GPIO.OUT)
GPIO.setup(beep, GPIO.OUT)

light = [red, green, blue]
lastLight = 0
thisLight = 0
for i in range(0, 10):
        GPIO.output(light[lastLight], GPIO.LOW)
        GPIO.output(beep, GPIO.LOW)
        time.sleep(1)
        lastLight = thisLight = i % 3
        GPIO.output(light[thisLight], GPIO.HIGH)
        GPIO.output(beep, GPIO.HIGH)
        time.sleep(1)

GPIO.cleanup()