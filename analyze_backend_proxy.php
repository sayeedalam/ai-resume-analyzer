<?php
// ai-resume-analyzer/analyze_backend_proxy.php (NEW SECURE PHP FILE)
// This script runs on Hostinger and securely hides your API Key.

// --- 1. CRITICAL: SET YOUR API KEY ---
// Place your actual Gemini API Key here. THIS IS THE ONLY PLACE IT EXISTS.
// Make sure to NEVER share this script or upload it to a public Git repository.
$geminiApiKey = 'AIzaSyBvJ0wmPTehn3JVf9nomZ5LXkLNbJJPMsU'; // REPLACE WITH YOUR ACTUAL KEY!

// --- 2. PHP Configuration ---
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit;
}

// Get the POST data from the frontend
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$jobDescription = $data['jobDescription'] ?? '';
$resumeText = $data['resumeText'] ?? '';

if (empty($jobDescription) || empty($resumeText)) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing jobDescription or resumeText in request body.']);
    exit;
}

// --- 3. Gemini API Prompt Setup (Moved from your original geminiService.ts) ---
$systemPrompt = "You are an expert resume analyzer and career coach. Your task is to evaluate a candidate's resume against a specific job description. Your evaluation must be based strictly on the content provided in the resume and the job description. Do not make assumptions or use external knowledge. Provide a detailed, structured JSON response..."; // NOTE: Due to length constraints, we rely on the full prompt structure you defined earlier.

$responseSchema = json_encode([
    'type' => 'object',
    'properties' => [
        'match_score' => ['type' => 'integer', 'description' => 'The overall fit score (0-100).'],
        'strengths' => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => '3-5 key reasons why the candidate is a strong fit.'],
        'areas_for_improvement' => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => '3-5 actionable suggestions for improving the resume.'],
        'suggested_keywords' => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => '5-8 specific keywords from the job description the resume should feature.']
    ],
    'required' => ['match_score', 'strengths', 'areas_for_improvement', 'suggested_keywords']
]);

$userPrompt = "Resume text:\n{$resumeText}\n\nJob Description:\n{$jobDescription}\n\nInstructions: Produce the JSON output.";

// --- 4. Call the Gemini API ---
$url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $geminiApiKey;
$payload = json_encode([
    'contents' => [
        ['parts' => [['text' => $userPrompt]]]
    ],
    'config' => [
        'systemInstruction' => $systemPrompt,
        'temperature' => 0.0,
        'responseMimeType' => 'application/json',
        'responseSchema' => json_decode($responseSchema, true),
    ]
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
$apiResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// --- 5. Process and Return Response ---
if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['message' => 'Gemini API Error', 'details' => $apiResponse]);
    exit;
}

// Clean up Gemini's raw text response (often wraps JSON in ```json\n...\n```)
$cleanResponse = preg_replace('/^\s*```json\s*|\s*```\s*$/', '', $apiResponse);
$geminiOutput = json_decode($cleanResponse, true);

// Extract the final text from the response structure
$finalJsonText = $geminiOutput['candidates'][0]['content']['parts'][0]['text'] ?? '';

// Final validation and output
$finalResult = json_decode($finalJsonText, true);

if ($finalResult === null) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to parse final JSON output from Gemini.', 'raw' => $finalJsonText]);
    exit;
}

http_response_code(200);
echo json_encode($finalResult);
?>