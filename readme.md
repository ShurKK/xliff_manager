# XLIFF File Processor

This Node.js application is designed to process `.xliff` files, specifically for scenarios involving translation workflows in WordPress.

## Purpose

The purpose of this application is to automate the translation workflow for corporate WordPress websites using WPML and Trados.

### Workflow:

1. **Export Files:**
   - Export your files to XLIFF 1.2 format and place them in the "original" folder of your translation project.

2. **Remove Target Content:**
   - Use the `target_remover.ts` script to strip any content within the `<target>` tags. This content should already be stored in your translation memory.

3. **Change File Extensions:**
   - In the `target_stripped` folder, change the file extensions of all `.xliff` files to `.xml`.

4. **Translate in Trados:**
   - Translate these `.xml` files in Trados. Trados should segment them properly, and the translated content will reside within the `<source>` segments.

5. **Recover Headers:**
   - Use the `header_recover.ts` script to prepare the files back into XLIFF format.

6. **Rename File Extensions:**
   - Rename the file extensions of all files in the `processed` folder back to `.xliff`.

7. **Import Translated Files:**
   - Import the translated files from the `processed` folder back into WordPress.

## Features

- **Stripping Content:** Removes certain tags or content from the original `.xliff` files to prepare them for translation.
- **Restoring Original Content:** After translation, the application can restore the original content from a stripped version of the file, ensuring that the original structure and content are maintained.
- **Handling Translations:** Copies content from `<source>` tags to `<target>` tags and restores the original `<source>` content from a stripped version of the file.
- **Flexible File Processing:** The application processes files based on user input provided via command-line arguments.

## Prerequisites

- Node.js (version 12.x or higher)
- NPM (Node Package Manager)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ShurKK/xliff_manager.git
