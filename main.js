const {app,  BrowserWindow,  ipcMain, dialog} = require('electron');
const fs = require('fs')
const path  = require('path')

function createWindow(){
    const win = new BrowserWindow({
        width: 1400,
        height: 800,
        minWidth:  1100,
        minHeight: 700,
        frame: true,
        backgroundColor: '#f7f9fb',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
}


app.whenReady().then(() => {
    createWindow
})

//to  save barcode as a png
ipcMain.handle('export-png',  async(event, data) => {
    const  {filePath,  canceled} = await dialog.showSaveDialog({
        title: 'Export as PNG',
        defaultPath: 'barcode.png',
        filters: [{name: 'PNG Image', extensions: ['png']}]
    })
    if(canceled || !filePath) return  {success:  false}

    console.log('imageData prefix:', data.imageData.substring(0, 50))
    console.log('filePath:', filePath)


    const base64 = data.imageData.split(',')[1]

    console.log('base64 start:', base64.substring(0, 30))

    fs.writeFileSync(filePath, base64, 'base64')

    return {success: true,  filePath}
})

//SVG export
ipcMain.handle('export-svg', async(event, data)=>{
    const {filePath, canceled} = await dialog.showSaveDialog({
        title: 'Export as SVG',
        default: 'barcode.svg',
        filters: [{name: 'SVG File', extensions: ['svg']}]
    })
    if(canceled || !filePath) return {success: false}

    fs.writeFileSync(filePath,  data.svgData, 'utf8')

    return {success:  true,  filePath}
})

//pdf export
ipcMain.handle('export-pdf', async(event) => {
    const {filePath, canceled}  = await dialog.showSaveDialog({
        title: 'Export as PDF',
        default: 'barcode.pdf',
        filters: [{name: 'PDF File', extensions: ['pdf']}]
    })

    if(canceled ||  !filePath) return {success: false}

    const  win =  BrowserWindow.getFocusedWindow()
    const pdfData = await  win.webContents.printToPDF({
        printBackground: true,
        pageSize:  'A4'
    })

    fs.writeFileSync(filePath, pdfData)

    return {success: true, filePath}
})


app.on('window-all-closed',   () =>{
    if(process.platform !==  'darwin'){
        app.quit()
    }
})

app.on('activate', () =>{
    if(BrowserWindow.getAllWindows().length == 0){
        createWindow()
    }
})