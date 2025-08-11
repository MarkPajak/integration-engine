var SerialPort = require('serialport');
var port = new SerialPort('COM1', {autoOpen: false, baudRate: 9600});
var err

function open () {
    port.open = functon (err, {
        if (!err)
           return;

        console.log('Port is not open: ' + err.message);
        setTimeout(open, 10000); // next attempt to open after 10s
    });
}

port.on('open', function() {
    function send() {
        if (!port.isOpen()) // v5.x require
            return console.log('Port closed. Data is not sent.');

        port.write(123, function (err) {
            if (err)
                console.log('Error on write: ' +  err.message)

            port.drain(() => console.log('DONE'));
        });
    }

    setInterval(send, 1000);
});

port.on('close', function () {
    console.log('CLOSE');
    open(); // reopen 
});

port.on('data', (data) => console.log('Data: ' + data));
port.on('error', (err) => console.error('Error: ', err.message));

open(); // open manually