//% color=#27b0ba icon="\uf26c" block="Basic Blocks"
namespace ds1820 {

    function resetDS18B20(DSpin: DigitalPin){
        //THIS MOST PROBABLY WORKS.
        let reading = 1
        //serial.writeLine(reading.toString())
        pins.digitalWritePin(DSpin,1)
        control.waitMicros(1000)

        pins.digitalWritePin(DSpin,0)
        control.waitMicros(500)

        pins.digitalWritePin(DSpin,1)
        control.waitMicros(10)
        let detected:boolean = false
        reading = pins.digitalReadPin(DSpin)
        if (reading){
            detected = false
        }
        else{
            detected = true
        }
        //serial.writeLine(reading.toString())
        return detected
    }
    
    function writeBitDS18B20(DSPin: DigitalPin, data: number){
        //recovery time
        //pins.digitalWritePin(DSPin,1)
        //control.waitMicros(15)

        //start writing bits
        pins.digitalWritePin(DSPin,0)
        if (data){
            control.waitMicros(5)
            pins.digitalWritePin(DSPin,1)
            control.waitMicros(55)
        }
        else{
            control.waitMicros(65)
            pins.digitalWritePin(DSPin,1)
            control.waitMicros(5)
        }

        //pins.digitalReadPin(DSPin)
        
    }

    function writeByteDS18b20(DSpin: DigitalPin, data:number){
        for(let i = 0;i < 8;i++){
            writeBitDS18B20(DSpin,data & 0x01)
            serial.writeLine((data & 0x01).toString())    
            data = data >> 1
                    
        }
        serial.writeLine("byteEnd")
    }

    function readBitDS18B20(DSPin: DigitalPin){
        let result:number
        //time for device to recover
        //pins.digitalWritePin(DSPin, 1)
        //control.waitMicros(15)

        //start reading
        pins.digitalWritePin(DSPin,0)
        control.waitMicros(3)
        pins.digitalWritePin(DSPin,1)
        control.waitMicros(5)
        if(pins.digitalReadPin(DSPin)){
            result = 1
        }
        else{
            result = 0
        }
        control.waitMicros(45)
        
        return result
    }

    function readByteDS18B20(DSPin: DigitalPin){
        let byte = 0x00
        for (let i = 0; i < 8; i++){
            byte = byte >> 1
            if (readBitDS18B20(DSPin)){
                control.waitMicros(2)
                byte =  byte | 0x80
            }
        }
        //serial.writeLine(byte.toString())
        return byte
        
    }





    //dumb workaround since microbit somehow doesnt support toString(16)
    let hexFortyFour = "01000100"
    let hexCC = "11001100"
    let hexBE = "10111110"
    let hexThirtyThree = "00110011"
    //% block="hello get pin on %DSPin"
    //% weight=3
    export function tempDS18B20(DSPin: DigitalPin){
        //pins.digitalWritePin(DSPin,0)
        //control.waitMicros(750)
        pins.digitalWritePin(DSPin,1)
        control.waitMicros(15)
        resetDS18B20(DSPin)

        control.waitMicros(100)
        writeByteDS18b20(DSPin,0xCC)
        writeByteDS18b20(DSPin,0x44)
        //pins.setPull(DSPin,PinPullMode.PullUp)
        control.waitMicros(2)

        //writeByteDS18b20(DSPin,0xCC)
        writeByteDS18b20(DSPin,0xBE)
        let byte0 = readByteDS18B20(DSPin)
        //control.waitMicros(100)
        let byte1 = readByteDS18B20(DSPin)
        
        let temperature = byte1 << 8 | byte0

        return temperature
    }
}