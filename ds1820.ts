//% color=#27b0ba icon="\uf26c" block="Basic Blocks"
namespace ds1820 {
    
    
    function resetDS1820(DSpin: DigitalPin){
        pins.digitalWritePin(DSpin,0)
        control.waitMicros(500)
        let response:Number = pins.digitalReadPin(DSpin)
        return response
    }

    function writeDS1820(DSpin: DigitalPin, data: Number){
        let binValueString = data.toString()
        for (let i = 0; i < binValueString.length; i++){
            let bit = binValueString[i]
            if (parseInt(bit) == 1){
                pins.digitalWritePin(DSpin,0)
                control.waitMicros(6)
                pins.digitalReadPin(DSpin)
                control.waitMicros(60)
            }
            if (parseInt(bit) == 0){
                pins.digitalWritePin(DSpin,0)
                control.waitMicros(60)    
                control.waitMicros(2)
            }
        }
    }
    
    function readDS1820(DSpin: DigitalPin){
        pins.digitalWritePin(DSpin,0)
        control.waitMicros(1)
        let reply = 0
        for (let i = 0;i<8;i++){
            //read 8 bits
            control.waitMicros(1)
            let ack = pins.digitalReadPin(DSpin)
            reply = (reply << 1) | ack     
            control.waitMicros(60)
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
        resetDS1820(DSPin)
        writeDS1820(DSPin, ZeroXCC)
        writeDS1820(DSPin, ZeroXBE)
        //reading temperature
    
        let temp = 0
        let byte0 = readDS1820(DSPin)
        let byte1 = readDS1820(DSPin)
        resetDS1820(DSPin)
        temp = (byte1 << 8)| byte0

        temp = temp >> 4
        let tempString = temp.toString()
        return tempString

    }
}