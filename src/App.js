//cd capstone\capstone-project 
//npm start
import './App.css';
import { createWorker } from 'tesseract.js';
import { useState } from 'react';
import { PDFDocument, PDFPage, save } from 'pdf-lib';
import { jsPDF } from "jspdf";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs'; 

//-----------------

const worker = await createWorker('eng',1, {
  logger: m => console.log(m)});

 
function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [numPages, setNumPages] = useState(null);
  //const [pageNumber, setPageNumber] = useState(1);

//TO DO:
  const handleChange = async (event) => {
  //param: file -> the input file (e.g. event.target.files[0])
  //return: images -> an array of images encoded in base64 
    const file = event.target.files[0];
    console.log("event target file loaded")
    console.log(file)
    GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.entry";
    // Load PDF and get the number of pages
      const pdf = await getDocument({ data: await readFileData(file) }).promise;
      const doob = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(doob);
      console.log(srcDoc);
      setNumPages(pdf.numPages);

    // Convert each page to an image
    const images = [];
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i+1);
      const viewport = page.getViewport({ scale: 2 }); // Adjust scale as needed
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      images.push(canvas.toDataURL('image/png'));
    }

    // Now 'images' contains data URLs of all pages
    // Now to turn the image back into a pdf
    //console.log(images);
    console.log("PDF is now an image!");
    
    //For one page pdf
    /*let newPdf;
    console.log("creating pdf");
    const res = await worker.recognize(images[0],{pdfTitle: "Example PDF"},{pdf: true});
    console.log(res);
    newPdf = res.data.pdf;
    setImagePath(newPdf)
    console.log("pdf created");
    console.log(newPdf);
    await worker.terminate();
    console.log("Worker terminated") 
    */
    //const mergedDocs = await PDFDocument.create();
    let newPdf;
    for (let i = 0; i < images.length; i++) {
      console.log("creating pdf "+i);
      console.log(images[i])
      const res = await worker.recognize(images[i],{pdfTitle: "Example PDF"},{pdf: true});
      console.log(res);
      newPdf = res.data.pdf;
      setImagePath(newPdf)
      

      console.log(newPdf);




        console.log("gorpin");
        const filePDF=new File([newPdf],'myPDF.pdf',{type: "text/pdf"});
        console.log(filePDF)
        const donorPdfBytes = await filePDF.arrayBuffer();  
        console.log(donorPdfBytes)
        const srcDoc = await PDFDocument.load(donorPdfBytes)
        const [idkPdf] = await pdfDoc.copyPages(srcDoc, [0]);
        pdfDoc.addPage(idkPdf);
        console.log(idkPdf);
        console.log("Type: "+typeof(idkPdf));

        console.log(i+" pdf created");
      
    }
    await worker.terminate();
    console.log("Worker terminated") 
    const link = document.createElement('a');
    if (link.download !== undefined) {
    const byteArray = await pdfDoc.save();
    console.log(byteArray)
    const blob = new  Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL( blob );
    const filename = 'tesseract-ocr-result.pdf';
    console.log(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  }
    /*
    //failed code snippets
    for (let i = 0; i < images.length; i++) {
      let newPdf;
      console.log("creating pdf "+i);
      const resPDF = await worker.recognize(images[i],{pdfTitle: "Example PDF"},{pdf: true});
      newPdf = resPDF.data.pdf;
      console.log(resPDF)

      var arrayBuffer;
var fileReader = new FileReader();
fileReader.onload = function(event) {
    arrayBuffer = event.target.result;
};
fileReader.readAsArrayBuffer(blob);
      const newPdfBytes = arrayBuffer(newPdf)
      console.log(newPdfBytes)
      console.log(newPdf);
      console.log("pdf created");
      await worker.terminate();
      console.log("Worker terminated")
  } */
  }
  //downloading the pdf
  const handleClick = async () => {
    console.log("click");
    const filename = 'tesseract-ocr-result.pdf';
    const blob = new Blob([new Uint8Array(imagePath)], { type: 'application/pdf' });
    if (navigator.msSaveBlob) {
      console.log("greep")
      navigator.msSaveBlob(blob, filename);
    } else {
      console.log("gorp")
      console.log(blob)
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
   

  const readFileData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
    });
  };
 
  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <p>{text}</p>
        <img src={text}></img>
        <embed
           src={text} className="App-image" alt="logo"/>
        
          <h3>Extracted text</h3>
        <div className="text-box">
          <script>  </script>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}>Download PDF</button>
      </main>
    </div>
  );
} 
 
export default App

/*Citations:
https://stackoverflow.com/questions/61637191/how-to-convert-pdf-to-image-in-reactjs
https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file
https://github.com/ScientaNL/pdf-extractor/blob/d7775ab76849bc5da7fc7a36175c6d446d383250/lib/PdfExtractor.js#L47
https://stackoverflow.com/questions/62744470/turn-pdf-into-array-of-pngs-using-javascript-with-pdf-js
https://github.com/naptha/tesseract.js/blob/master/examples/browser/download-pdf.html

*/