const fs = require('fs');
const path = require('path');

// put translated file into translated folder
// intermediate files should be save by other script into target_stripped folder
// as an argunent specify the parent folder containing all folders above

// Function to copy <source> content to <target> and recover original <source>
function processSourceAndTarget(translatedText, strippedText) {
    // Copy <source> content into <target>
    let updatedText = translatedText.replace(/<source.?>(.*?)<\/source>\s*(<target.*?><\/target>)/gs, '<source>$1</source><target>$1</target>');

    // Now recover the original <source> content from the stripped text
    const strippedSources = strippedText.match(/<source>(.*?)<\/source>/gs);
    const updatedSources = updatedText.match(/<source>(.*?)<\/source>/gs);

        strippedSources.forEach((sourceContent, index) => {
            updatedText = updatedText.replace(updatedSources[index], sourceContent);
        });

    return updatedText;
}

// Function to restore header and process translations
function recoverHeaderAndProcessFile(originalText, strippedText, translatedText) {
    // Find the header in the original text
    const headerMatch = originalText.match(/<header>(.*?)<\/header>/s);
    let recoveredText = translatedText;

    if (headerMatch) {
        const header = headerMatch[0];
        // Find the position of <header> in the original text
        const headerPosition = originalText.indexOf(header);
        
        // Recover the header at the same position in the translated text
        const beforeHeader = recoveredText.substring(0, headerPosition);
        const afterHeader = recoveredText.substring(headerPosition);
        recoveredText = beforeHeader + header + afterHeader;
    }

    // Process source and target as described
    recoveredText = processSourceAndTarget(recoveredText, strippedText);

    return recoveredText;
}

// Main function to process translated files
async function processTranslatedFiles(folderPath) {
    try {
        // Create the processed subfolder
        const processedFolder = path.join(folderPath, 'processed');
        const translatedFolder = path.join(folderPath, 'translated');

        if (!fs.existsSync(processedFolder)) {
            fs.mkdirSync(processedFolder);
        }

        // Read all files in the specified folder
        const files = fs.readdirSync(translatedFolder);

        // Filter .xliff files
        const xliffFiles = files.filter(file => file.endsWith('.xliff'));

        // Process each .xliff file
        xliffFiles.forEach(file => {
            const translatedFilePath = path.join(folderPath, file);
            const strippedFilePath = path.join(folderPath, 'target_stripped', file);
            const processedFilePath = path.join(processedFolder, file);

            // Read the original file content
            const originalFilePath = path.join(folderPath, 'original', file);
            const originalContent = fs.readFileSync(originalFilePath, 'utf8');
            const strippedContent = fs.readFileSync(strippedFilePath, 'utf8');
            const translatedContent = fs.readFileSync(translatedFilePath, 'utf8');

            // Recover the header and process the source/target content
            const processedContent = recoverHeaderAndProcessFile(originalContent, strippedContent, translatedContent);

            // Write the final processed content to the new file in the processed folder
            fs.writeFileSync(processedFilePath, processedContent, 'utf8');
            console.log(`Processed and saved: ${file} to processed folder`);
        });

        console.log('All .xliff files have been processed and saved to the processed folder.');
    } catch (err) {
        console.error('Error processing files:', err);
    }
}

// Ask the user for the folder path
if (process.argv[2]) {
    const folderPath = process.argv[2];
    processTranslatedFiles(folderPath);
}
else {
    console.log("no folder path")
}

return
