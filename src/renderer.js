const barcodeDataInput      = document.getElementById('barcode-data');
const barcodeTypeSelect     = document.getElementById('barcode-type')
const generateBtn           = document.getElementById('generate-btn');
const previewContainer      = document.getElementById('preview-container');
const statusType            = document.getElementById('status-type');
const statusDimensions      =  document.getElementById('status-dimensions');

//new controls
const widthSlider           = document.getElementById('width-slider')
const widthValue            = document.getElementById('width-value')
const heightSlider          = document.getElementById('height-slider')
const heightValue           = document.getElementById('height-value')
const showText              = document.getElementById('show-text')
const fgBtn                 = document.getElementById('fg-btn')
const fgColor               = document.getElementById('fg-color')
const fgSwatch              = document.getElementById('fg-swatch')
const bgBtn                 = document.getElementById('bg-btn')
const bgColor               = document.getElementById('bg-color')
const bgSwatch              = document.getElementById('bg-swatch')


function generateBarcode(){
    const data = barcodeDataInput.value.trim()
    const type = barcodeTypeSelect.value
    
    if(!data){
        alert("Please enter some barcode first.")
        return
    }

    previewContainer.innerHTML = ''

    if(type == 'QR Code'){
        generateQR(data)
    }
    else {
        generate1D(data, type)
    }
}

function generate1D(data, type){
    const canvas = document.createElement('canvas');

    const formatMap = {
        'Code128': 'CODE128',
        'EAN-13': 'EAN13',
        'UPC-A': 'UPC'
    }

    const format = formatMap[type] || 'CODE128'

    const dpr  = window.devicePixelRatio || 2
    
    try{
        JsBarcode(canvas,data, {
            format: format,
            lineColor: fgColor.value,
            background: bgColor.value,
            width: widthSlider.value  * dpr,
            height: heightSlider.value * dpr,
            displayValue: showText.checked,
            fontOptions: showText.checked,
            font: 'Space Grotesk',
            textAlign:'center',
            textPosition:'bottom',
            fontSize: 30 * dpr,
            margin: 24 * dpr
        })

        canvas.style.width = (canvas.width / dpr) + 'px';
        canvas.style.height = (canvas.height /dpr) +  'px';

        canvas.style.maxWidth = '100%'

        previewContainer.appendChild(canvas)

        statusType.textContent = `Type: ${type}`,
        statusDimensions.textContent = `Dimensions: ${canvas.width /dpr} x  ${canvas.height / dpr} px`
    } catch (error){
        previewContainer.innerHTML =  `
        <div style="color: #9f403d; font-family: 'Space Grotesk'; font-size: 13px; padding: 24px; text-align:center;">
        ⚠ Could not generate barcode.<br/>
        <span style="opacity:0.7; font-size:11px;">${error.message}</span>
      </div>
        `
    }
}

function generateQR(data) {

  // qrcode-generator works differently from the 'qrcode' package
  // Step 1: create a QR object. 
  // First argument: type number (0 = auto-select size)
  // Second argument: error correction level — 'M' = Medium (~15% recovery)
  const qr = qrcode(0, 'M')

  // Step 2: feed it the data
  qr.addData(data)

  // Step 3: compute — this is where the QR matrix is calculated
  qr.make()

  // Step 4: qrcode-generator draws to a <canvas> via createImgTag
  // but it also has a direct canvas method we'll use instead
  // We create a canvas and draw each QR cell manually
  const canvas = document.createElement('canvas')
  const  dpr =  window.devicePixelRatio || 2
  const cellSize = 8 * dpr          // each QR "pixel" = 6 real pixels
  const margin = 24 * dpr           // white space around the QR code
  const count = qr.getModuleCount()  // how many cells wide/tall the QR is

  // Set canvas size based on QR complexity + margin
  canvas.width  = count * cellSize + margin * 2
  canvas.height = count * cellSize + margin * 2

  // Get the drawing context — this is how you draw shapes onto a canvas
  const ctx = canvas.getContext('2d')

  // Fill background white
  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw each QR module (cell)
  ctx.fillStyle = fgColor.value   // our on-surface color

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {

      // qr.isDark(row, col) returns true if that cell should be dark
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          col * cellSize + margin,   // x position
          row * cellSize + margin,   // y position
          cellSize,                  // width
          cellSize                   // height
        )
      }
    }
  }

  canvas.style.width = (canvas.width/dpr) + 'px';
  canvas.style.height = (canvas.height/dpr) + 'px';
  canvas.style.maxWidth = '100%'

  // Add to page and update status bar
  previewContainer.appendChild(canvas)

  if(showText.checked){
    const label  = document.createElement('div')
    label.textContent = data

    label.style.fontFamily = 'Space Grotesk, sans-serif',
    label.style.fontSize = '12px',
    label.style.color = fgColor.value,
    label.style.textAlign = 'center',
    label.style.marginTop = '8px'
    label.style.letterSpacing = '0.05em'
    label.style.maxWidth = canvas.style.width,
    label.style.wordBreak = 'break-all'

    previewContainer.appendChild(label)

  }
  statusType.textContent       = 'Type: QR Code'
  statusDimensions.textContent = `Dimensions: ${canvas.width /dpr} x ${canvas.height /dpr} px`
}

generateBtn.addEventListener('click', generateBarcode)


//width  slider
widthSlider.addEventListener('input', ()=> {
    // Update the number displayed next to the slider in real time
    widthValue.textContent =  widthSlider.value
    // Regenerate immediately so the user sees the change live
    generateBarcode()
})

heightSlider.addEventListener('input',  ()=>{
    heightValue.textContent =  heightSlider.value
    generateBarcode()
})

showText.addEventListener('change', ()=>{
    generateBarcode()
})

fgBtn.addEventListener('click', ()=>{
    fgColor.click()
})

fgColor.addEventListener('input', ()=> {
    fgSwatch.style.backgroundColor = fgColor.value
    generateBarcode()
})

bgBtn.addEventListener('click', ()=>{
    bgColor.click()
})

bgColor.addEventListener('input',  ()=> {
    bgSwatch.style.backgroundColor = bgColor.value
    generateBarcode()
})

document.addEventListener('keydown', (event) => {
  const  cmdOrctrl  = event.metaKey || event.ctrlKey

  if(cmdOrctrl  && event.key.toLowerCase() === 'g'){
    event.preventDefault()
    generateBarcode()
  }

  if(cmdOrctrl &&  event.key.toLowerCase() ==='e'){
    event.preventDefault()
    exportPNG()
  }

  if(cmdOrctrl  && event.shiftKey &&  event.key.toLowerCase() === 'e'){
    event.preventDefault()
    exportSVG()
  }

  if(cmdOrctrl && event.key.toLowerCase()==='p'){
    event.preventDefault()
    exportPDF()
  }

  if(cmdOrctrl && event.shiftKey && event.key.toLowerCase() === 'c'){
    event.preventDefault()
    statusType.textContent = 'Clipboard support coming soon...'
  }
})


function  getCurrentCanvas(){
    return  previewContainer.querySelector('canvas')
}

//export functions

async function exportPNG() {
  const type = barcodeTypeSelect.value
  const data = barcodeDataInput.value.trim()
  const dpr  = window.devicePixelRatio || 2

  if (!data) {
    alert('Generate a barcode first.')
    return
  }

  // Instead of reading the existing canvas (which may be tainted),
  // we create a FRESH canvas just for export at a fixed high resolution
  // This guarantees clean image data we can export
  const exportCanvas = document.createElement('canvas')

  if (type === 'QR Code') {

    const qr       = qrcode(0, 'M')
    qr.addData(data)
    qr.make()

    const cellSize = 12          // larger cells = higher resolution export
    const margin   = 40
    const count    = qr.getModuleCount()

    exportCanvas.width  = count * cellSize + margin * 2
    exportCanvas.height = count * cellSize + margin * 2

    const ctx = exportCanvas.getContext('2d')

    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    ctx.fillStyle = fgColor.value

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            col * cellSize + margin,
            row * cellSize + margin,
            cellSize,
            cellSize
          )
        }
      }
    }

  } else {

    const formatMap = {
      'Code128' : 'CODE128',
      'EAN-13'  : 'EAN13',
      'UPC-A'   : 'UPC'
    }
    const format = formatMap[type] || 'CODE128'

    // Render at 4x resolution for a crisp PNG export
    const scale = 4
    JsBarcode(exportCanvas, data, {
      format      : format,
      lineColor   : fgColor.value,
      background  : bgColor.value,
      width       : widthSlider.value * scale,
      height      : heightSlider.value * scale,
      displayValue: showText.checked,
      font        : 'Space Grotesk',
      fontSize    : 16 * scale,
      margin      : 24 * scale
    })
  }

  // Now toDataURL works cleanly because this canvas was never tainted
  const imageData = exportCanvas.toDataURL('image/png')
  const result    = await window.api.exportPNG({ imageData })

  if (result.success) {
    statusType.textContent = `✓ Saved PNG to ${result.filePath}`
  }
}

async function exportSVG() {
    const type = barcodeTypeSelect.value

    if(type === 'QR Code'){
        alert('SVG export is only available for 1D barcodes.\nUse PNG for QR codes.')
    return
    }

    const canvas =  getCurrentCanvas()
    if(!canvas){
        alert('Please  generate a barcode first')
        return
    }

    const svg =  document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const  data = barcodeDataInput.value.trim()
    const  dpr  = window.devicePixelRatio || 2

    const formatMap = {
        'Code128' : 'CODE128',
        'EAN-13'  : 'EAN13',
        'UPC-A'   : 'UPC'
    }
    const format = formatMap[type] || 'CODE128'

  JsBarcode(svg, data, {
    format      : format,
    lineColor   : fgColor.value,
    background  : bgColor.value,
    width       : widthSlider.value,
    height      : heightSlider.value,
    displayValue: showText.checked,
    font        : 'Space Grotesk',
    fontSize    : 16,
    margin      : 24
  })

  const svgData = new XMLSerializer().serializeToString(svg)
  const result = await window.api.exportSVG({svgData})

  if(result.success){
    statusType.textContent = `Saved to  ${result.filePath}`
  }
}

async function exportPDF() {
    const  type = barcodeTypeSelect.value
    const data = barcodeDataInput.value.trim()

    if(!data){
        alert('Please  generate a barcode first')
        return
    }

    const exportCanvas = document.createElement('canvas')
      if(type  === 'QR Code'){
        const qr = qrcode(0, 'M')
        qr.addData(data)
        qr.make()

        const cellSize = 12
        const margin = 40
        const count  = qr.getModuleCount()

        exportCanvas.width  = count * cellSize + margin * 2
    exportCanvas.height = count * cellSize + margin * 2

    const ctx = exportCanvas.getContext('2d')
    ctx.fillStyle = bgColor.value
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    ctx.fillStyle = fgColor.value

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            col * cellSize + margin,
            row * cellSize + margin,
            cellSize, cellSize
          )
        }
      }
    }
  } else {
    const formatMap = { 'Code128': 'CODE128', 'EAN-13': 'EAN13', 'UPC-A': 'UPC' }
    const format    = formatMap[type] || 'CODE128'
    const scale     = 4

    JsBarcode(exportCanvas, data, {
      format      : format,
      lineColor   : fgColor.value,
      background  : bgColor.value,
      width       : widthSlider.value * scale,
      height      : heightSlider.value * scale,
      displayValue: showText.checked,
      font        : 'Space Grotesk',
      fontSize    : 16 * scale,
      margin      : 24 * scale
    })
  }
    const imageData = exportCanvas.toDataURL('image/png')
    const result  =  await window.api.exportPDF({imageData})

    if(result.success){
        statusType.textContent = `Saved  to ${result.filePath}`
    }
  }
generateBarcode()