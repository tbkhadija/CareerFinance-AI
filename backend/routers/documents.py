from fastapi import APIRouter, UploadFile, File
from services.ocr_service import extract_text_from_pdf, extract_text_from_image
from services.gemini_service import analyze_with_gemini

router = APIRouter()
@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_bytes = await file.read()
    
    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(file_bytes)
    elif file.content_type in ["image/jpeg", "image/png"]:
        text = extract_text_from_image(file_bytes)
    else:
        return {"error": "Format non pris en charge."}

    print("===== Texte extrait OCR =====")
    print(text)  # ✅ Ajoute ceci pour vérifier le texte extrait

    analysis = analyze_with_gemini(text)

    if "error" in analysis:
        return {"error": "Erreur d'analyse Gemini."}

    return {
        "fileName": file.filename,
        **analysis
    }

