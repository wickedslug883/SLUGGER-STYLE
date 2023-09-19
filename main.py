from fastapi import FastAPI
from deta import Deta

deta = Deta()  # Initialize Deta
db = deta.Base("your_space_name")  # Replace with your actual Space name

app = FastAPI()

@app.post("/api/highscores/")
async def add_score(name: str, score: int):
    new_entry = {
        "name": name,
        "score": score
    }
    db.put(new_entry)
    return {"message": "Score successfully added"}

@app.get("/api/highscores/")
async def get_scores():
    top_scores = db.fetch({}, limit=10, order_by="-score")
    return {"highscores": list(top_scores)}
