const { Renderer } = require("electron");

const path = require("path");

window.addEventListener("DOMContentLoaded", () => {
  
  window.AImove = function () {
    const { spawn } = require("child_process");
    //const childPython = spawn('python3.9',[path.join(__dirname,'externalScripts/TicTacToeAI.py'),parseBoard(board)]);

    AIpath = "externalScripts/";
    if (process.platform == "linux") {
      AIpath += "TicTacToeAI";
    }
    if (process.platform == "win32") {
      AIpath += "TicTacToeAI.exe";
    }

    const childPython = spawn(path.join(__dirname, AIpath), [
      parseBoard(board),
    ]);
    blockGrid();

    childPython.stdout.on("data", (data) => {
      var move = data.toString();
      console.log(`python out ${data}`);
      console.log(move);
      var i = move[1];
      var j = move[4];

      var id = i.toString() + j.toString();
      var block = document.getElementById(id);

      setTimeout(function () {
        changeBlock(block);
        updateBoard(block);
        unblockGrid();
      }, 1000);
    });

    childPython.stderr.on("data", (data) => {
      console.error(`python error  ${data}`);
    });
  };
  // version and autoupdate stuff
  window.updateVersion = function () {
    const { ipcRenderer } = require("electron");
    const version = document.getElementById("version");

    ipcRenderer.send("app_version");
    ipcRenderer.on("app_version", (event, arg) => {
      ipcRenderer.removeAllListeners("app_version");
      version.innerText = "Version " + arg.version;
    });
  };
});
console.log("Preload was loaded");