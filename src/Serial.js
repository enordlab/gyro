class Serial {

  constructor() {
    this.comm = undefined;
    this.reader= undefined;
    this.writer= undefined;
    this.enc = new TextEncoder();
    this.dec = new TextDecoder();
    this.running = false;

    this.app = undefined;
  }

  setApp = (app) => {
    this.app = app;
  }

  // the user wants to connect to an emulated COM port
  connect = async () =>
  {
    if ('serial' in navigator) {
      try {
        this.comm = await navigator.serial.requestPort({});
        await this.comm.open({ baudRate: 115200, bufferSize: 64 });
        this.reader = this.comm.readable.getReader();
        this.writer = this.comm.writable.getWriter();
        setTimeout(this.receive, 100);
        // document.getElementById("command").disabled = false;
        // document.getElementById("command").focus();
      } catch(err) {
        document.getElementById("results").innerHTML += err.message.replace(/</g,'&lt;').replace(/>/g,'&gt;') + "\r";
      }
    } else {
      document.getElementById("results").innerHTML +=
  `The Web serial API needs to be enabled in your browser thru:
      - <a href=edge://flags/#enable-experimental-web-platform-features>edge://flags/#enable-experimental-web-platform-features</a>
      - <a href=chrome://flags/#enable-experimental-web-platform-features>chrome://flags/#enable-experimental-web-platform-features</a>
      - <a href=opera://flags/#enable-experimental-web-platform-features>opera://flags/#enable-experimental-web-platform-features</a>
  `;
    }
  }

  // receive a string from the device
  receive = async () =>
  {
    var result;
    var str;

    result = await this.reader.read();
    str = this.dec.decode(result.value);
    // console.log("receive", str.length, str)

    // document.getElementById("results").innerHTML += str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'');
    // document.getElementById("command").scrollIntoView();

    this.app.update(str)

    if (this.running)
      setTimeout(this.receive, 10);
  }

  // send a string to the device
  send = async (str) =>
  {
    console.log("send", str.length, str)
    str = str.substr(0,1)

    await this.writer.write(this.enc.encode(str).buffer);

    // document.getElementById("command").value = "";
    // document.getElementById("command").focus();

    this.receive();

  }

  start = async () =>
  {
    // var str = document.getElementById("command").value;
    var str = "1";
    this.send(str + "\r");
    this.running = true;
  }

  stop = async () =>
  {
    this.running = false;
  }

}

export default Serial

