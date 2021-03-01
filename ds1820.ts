//% color=#27b0ba icon="\uf26c" block="Basic Blocks"
namespace ds1820 {
    function resetDS1820(DSpin: DigitalPin){
        pins.digitalWritePin(DSpin,0)
        control.waitMicros(500)
        let response:Number = pins.digitalReadPin(DSpin)
        return response
    }

    function writeDS1820(DSpin: DigitalPin, data: Number){
        let dataString = data.toString()
        let bytes = parseInt(dataString, 16);
        for (let i = 0; i < dataString.length; i++){
            let bit = dataString[i]
            if (parseInt(bit) == 1){
                pins.digitalWritePin(DSpin,0)
                control.waitMicros(10)
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

    //% block="hello get pin on %DSPin"
    //% weight=3
    export function tempDS1820(DSPin: DigitalPin){
        resetDS1820(DSPin)
        writeDS1820(DSPin,0xCC)
        writeDS1820(DSPin,0x44)
        //reading temperature
        let temp = 0
        for (let i = 0; i<2; i++){
            let response = readDS1820(DSPin)
            temp = (temp << 8)| response
        }
        return temp

    }
}

