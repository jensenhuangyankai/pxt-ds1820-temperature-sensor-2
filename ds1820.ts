//% color=#27b0ba icon="\uf26c" block="Basic Blocks"
namespace ds1820 {
    function makeHigh(DSpin: DigitalPin){
        pins.digitalReadPin(DSpin)
    }

    
    function resetDS1820(DSpin: DigitalPin){
        control.waitMicros(10)
        let detected = 1
        pins.setPull(DSpin,PinPullMode.PullUp)
        pins.digitalWritePin(DSpin,0)
        control.waitMicros(480)
        pins.digitalReadPin(DSpin)
        control.waitMicros(70)
        detected = pins.digitalReadPin(DSpin)
        control.waitMicros(480)
        if (detected == 1){
            serial.writeLine("trash device gg uninstall")
            //TLDR detected variable should equals zero when device is actually detected
        }
        else{
            serial.writeLine("Connected!")
        }
        return detected
    }

    function writeDS1820(DSpin: DigitalPin, data: Number){
        let binValueString = data.toString()
        for (let i = 0; i < binValueString.length; i++){
            let bit = binValueString[i]
            if (parseInt(bit) == 1){
                pins.digitalWritePin(DSpin,0)
                control.waitMicros(6)
                pins.digitalReadPin(DSpin)
                control.waitMicros(65)
            }
            if (parseInt(bit) == 0){
                pins.digitalWritePin(DSpin,0)
                control.waitMicros(60)
                pins.digitalReadPin(DSpin)    
                control.waitMicros(10)
            }
        }
    }
    
    function readBitDS1820(DSpin: DigitalPin){
        let data:number
        control.waitMicros(1)
        pins.setPull(DSpin,PinPullMode.PullUp)
        control.waitMicros(12)
        data = pins.digitalReadPin(DSpin)
        control.waitMicros(47)
        return data
    }
    function readByteDS1820(DSpin: DigitalPin){
        //reading 8 bits then combines into a byte
        
        let reply = 0
        for (let i = 0;i<8;i++){
            let bit = readBitDS1820(DSpin)
            reply =  reply << 1 | bit
        }
        
        return reply
    }
    
    //dumb workaround since microbit somehow doesnt support toString(16)
    let ZeroXFortyFour = 1000100
    let ZeroXCC = 11001100
    let ZeroXBE = 10111110
    //% block="hello get pin on %DSPin"
    //% weight=3
    export function tempDS1820(DSPin: DigitalPin){
        resetDS1820(DSPin)
        writeDS1820(DSPin, ZeroXCC)
        writeDS1820(DSPin, ZeroXFortyFour)
        control.waitMicros(750)
        resetDS1820(DSPin)
        writeDS1820(DSPin, ZeroXCC)
        writeDS1820(DSPin, ZeroXBE)
        //reading temperature
    
        let temp = 0
        let byte0 = readByteDS1820(DSPin)
        let byte1 = readByteDS1820(DSPin)
        resetDS1820(DSPin)
        temp = (byte1 << 8)| byte0

        //temp = temp >> 4
        let tempString = temp.toString()
        return tempString
        serial.writeLine(temp.toString())

    }
}