//% color=#27b0ba icon="\uf26c" block="Basic Blocks"
namespace ds1820 {

    function resetDS1820(DSpin: DigitalPin){
        let detected = 1
        pins.setPull(DSpin,PinPullMode.PullUp)
        pins.digitalWritePin(DSpin,0)
        control.waitMicros(600)
        pins.digitalReadPin(DSpin)
        control.waitMicros(30)
        detected = pins.digitalReadPin(DSpin)
        control.waitMicros(60)
        if (detected == 1){
            serial.writeLine("trash device gg uninstall")
            //TLDR detected variable should equals zero when device is actually detected
        }
        else{
            serial.writeLine("Connected!")

        }
        return detected
    }
    

    function writeBitDS1820(DSpin: DigitalPin,data: string){
        pins.digitalWritePin(DSpin,0)
        if (parseInt(data)){
            pins.digitalWritePin(DSpin,1)
            control.waitMicros(55)
        }
        else {
            control.waitMicros(60)
            pins.digitalWritePin(DSpin,1)
            control.waitMicros(10)
        }
        pins.setPull(DSpin,PinPullMode.PullUp)
    }
    function writeByteDS1820(DSpin: DigitalPin, data: string){
        for (let i = 7; i >= 0;i--){
            writeBitDS1820(DSpin, data[i])
            serial.writeLine(data[i])
        }

    }

    function readBitDS1820(DSpin: DigitalPin){
        pins.digitalWritePin(DSpin,0)
        pins.digitalWritePin(DSpin,1)
        control.waitMicros(3)
        pins.digitalReadPin(DSpin)
        control.waitMicros(3)
        let data:number
        if (pins.digitalReadPin(DSpin)){
            data = 1
        }
        else{
            data = 0
        }
        control.waitMicros(45)
        return data
    }
    function readByteDS1820(DSpin: DigitalPin){
        //reading 8 bits then combines into a byte
        
        let reply = 0
        for (let i = 0;i<8;i++){
            
            let bit = readBitDS1820(DSpin)
            reply =  (reply << 1) | bit
        }
        
        return reply
    }
    
    function checkROM(DSPin: DigitalPin){
        writeByteDS1820(DSPin,hexThirtyThree)
        let code =  readByteDS1820(DSPin)
        if (code == 101000){
            serial.writeLine("OK")
            return true
        }
        else{
            serial.writeLine("GG romcode wrong")
            serial.writeLine(code.toString())
            return false
        }
    }
    //dumb workaround since microbit somehow doesnt support toString(16)
    let hexFortyFour = "01000100"
    let hexCC = "11001100"
    let hexBE = "10111110"
    let hexThirtyThree = "00110011"
    //% block="hello get pin on %DSPin"
    //% weight=3
    export function tempDS1820(DSPin: DigitalPin){
        resetDS1820(DSPin)
        //control.waitMicros(100)
        checkROM(DSPin)
        return "yes"
        /*
        writeByteDS1820(DSPin,hexCC)
        writeByteDS1820(DSPin,hexFortyFour)
        
        
        
        
        control.waitMicros(1000)
        resetDS1820(DSPin)
        writeByteDS1820(DSPin,hexCC)
        writeByteDS1820(DSPin, hexBE)
        //reading temperature
        //pins.setPull(DSPin,PinPullMode.PullNone)
        let temp = 0
        let byte0 = readByteDS1820(DSPin)
        let byte1 = readByteDS1820(DSPin)
        //resetDS1820(DSPin)
        temp = (byte1 << 8 | byte0)

        //temp = temp >> 4
        let tempString = temp.toString()
        serial.writeLine(temp.toString())
        return tempString
        */

    }
}