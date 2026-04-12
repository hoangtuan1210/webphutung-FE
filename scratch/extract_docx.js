const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

function extractTextFromDocx(filePath) {
    try {
        // Since I don't have adm-zip, I'll use PowerShell to extract
        const tempDir = path.join(__dirname, 'temp_docx');
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
        fs.mkdirSync(tempDir);
        
        execSync(`powershell -Command "Expand-Archive -Path '${filePath}' -DestinationPath '${tempDir}'"`);
        
        const xmlPath = path.join(tempDir, 'word', 'document.xml');
        if (!fs.existsSync(xmlPath)) return "Could not find document.xml";
        
        const xml = fs.readFileSync(xmlPath, 'utf8');
        // Simple regex to extract text from <w:t> tags
        const text = xml.match(/<w:t[^>]*>(.*?)<\/w:t>/g)
            ?.map(val => val.replace(/<[^>]+>/g, ''))
            .join(' ') || "";
            
        return text;
    } catch (e) {
        return "Error: " + e.message;
    }
}

const files = [
    'CHÍNH SÁCH BẢO HÀNH.docx',
    'CHÍNH SÁCH.docx',
    'Chính sách thanh toán và vận chuyển.docx',
    'THÔNG TIN CÔNG TY.docx'
];

const results = {};
files.forEach(f => {
    const fullPath = path.join('c:/Users/hoangtuan/Documents/work/webphutung-FE/data', f);
    results[f] = extractTextFromDocx(fullPath);
});

console.log(JSON.stringify(results, null, 2));
