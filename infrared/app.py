import RPi.GPIO as GPIO
import time
import threading

infaredPIN = 18
beepPIN = 33
lightPIN = 13
status = 0

GPIO.setmode(GPIO.BOARD)

GPIO.setup(infaredPIN, GPIO.IN)
GPIO.setup(beepPIN, GPIO.OUT)
GPIO.setup(lightPIN, GPIO.OUT)

def my_callback(channel):
    status = GPIO.input(channel)
    if(status):
        GPIO.output(beepPIN, GPIO.HIGH)
        GPIO.output(lightPIN, GPIO.HIGH)
        time.sleep(0.1)
        GPIO.output(beepPIN, GPIO.LOW)
        GPIO.output(lightPIN, GPIO.LOW)
        time.sleep(0.1)
        GPIO.output(beepPIN, GPIO.HIGH)
        GPIO.output(lightPIN, GPIO.HIGH)
        time.sleep(0.1)
        GPIO.output(beepPIN, GPIO.LOW)
        GPIO.output(lightPIN, GPIO.LOW)
        time.sleep(1)
        my_callback(18)
    else:
        GPIO.output(beepPIN, GPIO.LOW)
        GPIO.output(lightPIN, GPIO.LOW)
        return

GPIO.add_event_detect(infaredPIN, GPIO.BOTH, callback=my_callback, bouncetime=200)

try:
    while True:
        print("I'm watching")
        time.sleep(5)

except KeyboardInterrupt:
    pass

GPIO.cleanup()

