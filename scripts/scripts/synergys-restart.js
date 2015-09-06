#! /usr/bin/env shjs

/* Restart synergy server */

require('shelljs/global');

config.silent = true;

var envVarNames = ["SYNERGY_SERVER_ADDRESS", "SYNERGY_SERVER_EXEC_PATH",
    "SYNERGY_SERVER_CONFIG_PATH"];
var envVars = envVarNames.map(function(envVarName) {
  var envVar = env[envVarName];
  if(envVar === undefined || envVar === "")
  {
    throw Error("Environment variable " + envVarName + " is empty/absent");
  }
  return envVar;
});

var username = exec("whoami").output.trim("\n");
var procLines = exec("ps aux").output.split('\n').filter(function(procLine) {
    var re = new RegExp(".*" + username + ".*" + env.SYNERGY_SERVER_EXEC_PATH,
            "g");
    return re.test(procLine);
});

if(procLines.length > 1)
{
    throw Error("There is more than 1 server running");
}
else if(procLines.length === 1)
{
    var serverPID = /\S+\s+(\d+)\s+.*/i.exec(procLines[0])[1];
    console.log("Killing process with PID: " + serverPID + "...");
    exec("kill -9 " + serverPID);
}

console.log("Starting new server process...");
exec(env.SYNERGY_SERVER_EXEC_PATH + " -a " + env.SYNERGY_SERVER_ADDRESS + 
        " -c " + env.SYNERGY_SERVER_CONFIG_PATH);
