const H = (globalThis.__handlers = {});
class BW { constructor(){ this.webContents = {on(){},setWindowOpenHandler(){},toggleDevTools(){},getPrintersAsync:async()=>[]}; } on(){} loadURL(){} loadFile(){} show(){} static getAllWindows(){return [];} }
module.exports = {
  app:{whenReady:()=>Promise.resolve(),on(){},quit(){},getPath:()=>"/",getVersion:()=>"1.1.0"},
  BrowserWindow:BW, dialog:{}, shell:{openExternal:u=>window.open(u,"_blank")},
  ipcMain:{handle:(c,f)=>{H[c]=f;}},
  ipcRenderer:{invoke:async(c,...a)=>H[c]?H[c]({},...a):{ok:false,error:"Phone par support nahi: "+c}},
  contextBridge:{exposeInMainWorld:(k,v)=>{window[k]=v;}}
};
