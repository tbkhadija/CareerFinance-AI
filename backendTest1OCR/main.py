from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import documents
from routers import salary


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(documents.router, prefix="/api/documents")
app.include_router(salary.router, prefix="/api/salary")


