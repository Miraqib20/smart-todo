from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from .auth import router as auth_router
from .todos import router as todos_router

app = FastAPI(
    title="Todo API with JWT Security",
    version="1.0"
)

# CORS setup
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router, tags=["Auth"])
app.include_router(todos_router, tags=["Todos"])


@app.get("/")
def root():
    return {"message": "Todo API is running!"}

# 👉 Add JWT Bearer security globally for Todos APIs
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description="Todo App Backend",
        routes=app.routes,
    )

    # Define Security Scheme (JWT)
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # Apply security only to Todos endpoints
    for path, methods in openapi_schema["paths"].items():
        for method, details in methods.items():
            if "Todos" in details.get("tags", []):
                details.setdefault("security", [])
                details["security"].append({"BearerAuth": []})

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
