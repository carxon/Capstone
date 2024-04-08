//cd Capstone\my-react-app
//npm start
import './App.css';
import { createWorker } from 'tesseract.js';
import { useState } from 'react';
//import * as fsModule from 'fs';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';

const fs = require('fs');


//-----------------
const worker = await createWorker('eng',1, {
  logger: m => console.log(m)});

 
function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [bool, setBool] = useState(true);
  //const [pageNumber, setPageNumber] = useState(1);
  const [,, imagesPath] = process.argv;
const image = path.resolve(__dirname, (imagesPath || '../../tests/assets/images/cosmic.png'));
const path = require('path');  

//TO DO:
  const handleChange = async (event) => {
  //param: file -> the input file (e.g. event.target.files[0])
  //return: images -> an array of images encoded in base64 
    const file = event.target.files[0];
    console.log("event target file loaded")
    GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.entry";
    // Load PDF and get the number of pages
      const pdf = await getDocument({ data: await readFileData(file) }).promise;
      setNumPages(pdf.numPages);

    // Convert each page to an image

    const images = [];
    let intervalID = setInterval(ConsoleImgLogger, 2000)
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 }); // Adjust scale as needed
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      images.push(canvas.toDataURL('image/png'));
    }

    // Now 'images' contains data URLs of all pages
    clearInterval(intervalID)
    console.log(images);
    console.log("PDF is now an image!");
    setImagePath(images[0]);
    return images;
  }

  const handleClick = async () => {
    console.log("click");
    //setImagePath(imagePath);
    const { data: { text, pdf } } = await worker.recognize(image, {pdfTitle: "Example PDF"}, {pdf: true});      
    console.log("text is"+text);
      setText(text);
      //fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdf));
      await worker.terminate();
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

  const ConsoleImgLogger = () => {
    if (bool == true) {
      console.log("Converting PDF.");
      setBool(false);
    }
    else {
      console.log("Converting PDF...")
      setBool(true);
    }
  }
 
  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <p>{imagePath}</p>
        <img src={imagePath}></img>
        <embed
           src={imagePath} className="App-image" alt="logo"/>
        
          <h3>Extracted text</h3>
        <div className="text-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}> convert to text</button>
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

*/