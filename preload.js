const {contextBridge,   ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api',  {
    exportPNG: (data)   => ipcRenderer.invoke('export-png', data),
    exportSVG: (data)   => ipcRenderer.invoke('export-svg', data),
    exportPDF: ()       => ipcRenderer.invoke('export-pdf')
})