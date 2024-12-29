import fs from 'fs';
import path from 'path';

const jsonFilePath = './assets/commonWords.json'; // Replace 'data.json' with your actual file name

const readDictonary = ()=>{
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return;
        }

        try {
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData)) {
                global = { ...global, dictonary: parsedData };
                console.log('Data successfully loaded into dictonary');
            } else {
                console.error('The JSON file does not contain an array.');
            }
        } catch (parseError) {
            console.error('Error parsing the JSON file:', parseError);
        }
    });
}

readDictonary();
export default readDictonary;


