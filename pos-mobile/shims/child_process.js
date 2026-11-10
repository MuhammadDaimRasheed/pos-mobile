function id(){let v=localStorage.getItem("deviceId");if(!v){v=crypto.randomUUID();localStorage.setItem("deviceId",v);}return v;}
module.exports={execSync:()=>"MachineGuid    REG_SZ    "+id(),execFile(){}};
