const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to recover the header in processed files
function recoverHeader(originalText, strippedText) {
    const headerMatch = originalText.match(/<header>(.*?)<\/header>/s);
    if (headerMatch) {
        const header = headerMatch[0];
        const headerStartPosition = originalText.indexOf(header);
        
        // Split the stripped content into two parts: before and after the header position
        const beforeHeader = strippedText.substring(0, headerStartPosition);
        const afterHeader = strippedText.substring(headerStartPosition);

        // Place the header back in the same position
        const recoveredText = beforeHeader + header + afterHeader;
        return recoveredText;
    }
    return strippedText; // In case there was no header to begin with
}

// Function to recover headers in .xliff files
async function recoverFiles(folderPath) {
    try {
        // Create the recovered_heads subfolder
        const recoveredFolder = path.join(folderPath, 'recovered_heads');

        if (!fs.existsSync(recoveredFolder)) {
            fs.mkdirSync(recoveredFolder);
        }

        // Read all files in the specified folder
        const files = fs.readdirSync(folderPath);

        // Filter .xliff files
        const xliffFiles = files.filter(file => file.endsWith('.xliff'));

        // Process each .xliff file
        xliffFiles.forEach(file => {
            const filePath = path.join(folderPath, file);
            const strippedPath = path.join(folderPath, 'target_stripped', file);
            const recoveredPath = path.join(recoveredFolder, file);

            // Read the original file content
            const originalContent = fs.readFileSync(filePath, 'utf8');
            const strippedContent = fs.readFileSync(strippedPath, 'utf8');

            // Recover the header and save the file in the recovered_heads folder
            const recoveredContent = recoverHeader(originalContent, strippedContent);
            fs.writeFileSync(recoveredPath, recoveredContent, 'utf8');
            console.log(`Header recovered and saved: ${file} to recovered_heads`);
        });

        console.log('All .xliff files have had their headers recovered and saved to the recovered_heads folder.');
    } catch (err) {
        console.error('Error processing files:', err);
    }
}

// Ask the user for the folder path
rl.question('Please enter the path to the folder containing .xliff files for recovering: ', (folderPath) => {
    recoverFiles(folderPath);
    rl.close();
});
