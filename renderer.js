import JsBarcode  from "jsbarcode";

const dataInput= document.getElementById('barcodeData');
const preview = document.getElementById('preview');

dataInput.addEventListener('input', () =>{
    preview.innerHTML = '<svg id="barcode"></svg>';

    JsBarcode("#barcode", dataInput.value || "123456",  {
        width:  2,
        height: 100,
        displayValue:  true
    });
});