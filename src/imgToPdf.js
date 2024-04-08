//cd Capstone\my-react-app
//npm start
//import './App.css';
import { createWorker } from 'tesseract.js';
import * as fs from 'fs';
import { getDocument } from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'react-pdf/node_modules/pdfjs-dist/build/pdf.js';
import * as pdfjs from 'pdfjs-dist/webpack.mjs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
  const [,, imagePath] = process.argv;
const image = path.resolve(__dirname, (imagePath || 'C:\LIS\Capstone\KNI_A_ALA.tif'));

const readFileData = (file) => {
  //TODO make this read and spit out the file blob
  console.log("Reading file data")
    try {
      const data = fs.readFileSync(file, 'utf8');
      return new Uint8Array(data);
    } catch (err) {
      console.error(err);
    }
};

(async () => {
      try {
          //param: file -> the input file (From folder)
  //return: images -> an array of images encoded in base64 
        const file = 'C:/LIS/Capstone/my-react-app/KNI_A_ALA.pdf';
        console.log("file loaded");
        // Set up PDF.js worker source
        GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.entry';
                // Load PDF and get the number of pages
        console.log("Loading pdf");
        const pdf = await pdfjs.getDocument({ data: await readFileData(file) }).promise;
        console.log(pdf);


    // Convert each page to an image    

    const images = [];
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
    console.log(images);
    console.log("PDF is now an image!");
    return images;      
  } catch (error) {
      console.error(error);
    }
  })();
/*
  (async () => {
    const worker = await createWorker('eng',1, {
  logger: m => console.log(m)});
    const { data: { text, pdf } } = await worker.recognize(image, {pdfTitle: "Example PDF"}, {pdf: true});      
    console.log("text is"+text);
      //fs.writeFileSync('tesseract-ocr-result.pdf', Buffer.from(pdf));
      await worker.terminate();
    })();
   */



/*Citations:
https://stackoverflow.com/questions/61637191/how-to-convert-pdf-to-image-in-reactjs
https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file
https://github.com/ScientaNL/pdf-extractor/blob/d7775ab76849bc5da7fc7a36175c6d446d383250/lib/PdfExtractor.js#L47
https://stackoverflow.com/questions/62744470/turn-pdf-into-array-of-pngs-using-javascript-with-pdf-js
https://iamwebwiz.medium.com/how-to-fix-dirname-is-not-defined-in-es-module-scope-34d94a86694d
*/