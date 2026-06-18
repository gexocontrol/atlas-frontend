// --- Core UI Element Selectors ---
// Global scope loader fallback for standard browser environments
const GEMINI_API_KEY = "AIzaSyA396KO9gNIR8qj1EZPdaCixm40q7Mh7ds";

// Initialize the Google GenAI instance using the UMD bundle global object
const ai = new google.genai.GoogleGenAI({ apiKey: GEMINI_API_KEY });

const studentFileInput = document.getElementById('student-file');
const teacherFileInput = document.getElementById('teacher-file');
const analyzeBtn = document.getElementById('analyze-btn');
const generateBtn = document.getElementById('generate-btn');
const outputDisplay = document.getElementById('output-display');

let selectedStudentImage = null;
let selectedTeacherPdf = null;

studentFileInput.addEventListener('change', (e) => {
    selectedStudentImage = e.target.files[0];
    if(selectedStudentImage) logStatus(`READY: "${selectedStudentImage.name}" loaded.`);
});

teacherFileInput.addEventListener('change', (e) => {
    selectedTeacherPdf = e.target.files[0];
    if(selectedTeacherPdf) logStatus(`READY: "${selectedTeacherPdf.name}" loaded.`);
});

analyzeBtn.addEventListener('click', async () => {
    if (!selectedStudentImage) {
        logStatus('ERROR: Please select an exam picture first.');
        return;
    }

    logStatus('PROCESSING: Executing structural check against Cambridge criteria...');

    try {
        const imageBlob = await fileToGenerativePart(selectedStudentImage);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: "You are a strict Cambridge Examiner. Look at this handwritten student answer. Check it against official CIE Mark Scheme keywords. Point out exactly where they lost marks, what keyword was missing, and give a corrected structural layout for full marks." },
                        imageBlob
                    ]
                }
            ]
        });

        outputDisplay.textContent = response.text;

    } catch (error) {
        logStatus(`API ERROR: Verification failed. Code details: ${error.message}`);
    }
});

async function fileToGenerativePart(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve({
                inlineData: {
                    data: reader.result.split(',')[1],
                    mimeType: file.type
                },
            });
        };
        reader.readAsDataURL(file);
    });
}

function logStatus(message) {
    outputDisplay.textContent = `[LOG] ${message}`;
}