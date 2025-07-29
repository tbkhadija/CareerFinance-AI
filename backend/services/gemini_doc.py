import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

# Charger les variables d'environnement
load_dotenv()

# Lire la clé API depuis .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY non trouvé dans le fichier .env")

# Configurer Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Créer le modèle
model = genai.GenerativeModel("gemini-2.0-flash-exp")

def analyze_with_gemini(text: str) -> dict:
    prompt = f"""
Voici un texte extrait d’un bulletin de paie :

--------------------
{text}
--------------------

Analyse le contenu et retourne un objet JSON avec les 4 sections suivantes :

{{
  "resume": {{
    "salaireBrut": ...,
    "salaireNet": ...,
    "cotisations": ...,
    "impots": ...
  }},
  "details": {{
  "salaireBase": 20000,
  "primes": [
    {{ "libelle": "Prime ancienneté", "montant": 1000 }},
    {{ "libelle": "Prime performance", "montant": 2000 }}
  ],
  "heuresSupp": [
    {{ "libelle": "Heures nuit", "montant": 500 }},
    {{ "libelle": "Heures week-end", "montant": 1500 }}
  ],
  "cotisations": [
    {{ "libelle": "CNSS", "montant": 800, "type": "patronale" }},
    {{ "libelle": "Retraite", "montant": 500, "type": "salariale" }}
  ],
  "impots": [
    {{ "libelle": "IR", "montant": 2000 }}
  ],
  "netAPayer": 19500
}},

  "anomalies": [
    {{
      "titre": "...",
      "description": "...",
      "impact": "Faible | Moyen | Élevé | Positif"
    }}
  ],
  "recommandations": [
    "Phrase conseil 1",
    "Phrase conseil 2",
    ...
  ]
}}
👉 Utilise des valeurs numériques en MAD (pas de string).
👉 N'utilise **aucune balise Markdown** (ex: pas de ```json).
👉 Le JSON doit être **valide et prêt à parser** avec `json.lo
👉 Donne des recommandations personnalisées en lien avec le texte.

Retourne seulement l’objet JSON.
"""

    try:
        response = model.generate_content(prompt)
        cleaned = response.text.strip()

        # Nettoyer les balises Markdown si présentes
        if cleaned.startswith("```json") or cleaned.startswith("```"):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()

        print("💬 Réponse Gemini brute :\n", response.text)
        print("📦 Après nettoyage :\n", cleaned)

        return json.loads(cleaned)

    except Exception as e:
        print("❌ Erreur Gemini :", e)
        return {"error": "Erreur d'analyse Gemini."}
