const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to apply regex and remove target content
function stripTargetContent(text) {
    const regex = /(<target.*?>)(.*?)(<\/target>)/gs;
    const removedTarget = text.replace(regex, "$1$3").replace(/<header>(.*?)<\/header>/gs, "");
    return removedTarget;
}

// Main function to process the files
async function processFiles(folderPath) {
    try {
        // Create the new subfolder
        const targetFolder = path.join(folderPath, 'target_stripped');
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }

        // Read all files in the specified folder
        const files = fs.readdirSync(folderPath);

        // Filter .xliff files
        const xliffFiles = files.filter(file => file.endsWith('.xliff'));

        // Process each .xliff file
        xliffFiles.forEach(file => {
            const filePath = path.join(folderPath, file);
            const targetPath = path.join(targetFolder, file);

            // Read the file content
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Apply the regex to strip the target content
            const strippedContent = stripTargetContent(fileContent);

            // Write the processed content to the new file in the target_stripped folder
            fs.writeFileSync(targetPath, strippedContent, 'utf8');
            console.log(`Processed and copied: ${file}`);
        });

        console.log('All .xliff files have been processed and copied to the target_stripped folder.');
    } catch (err) {
        console.error('Error processing files:', err);
    }
}

// Ask the user for the folder path
rl.question('Please enter the path to the folder containing .xliff files: ', (folderPath) => {
    processFiles(folderPath);
    rl.close();
});
