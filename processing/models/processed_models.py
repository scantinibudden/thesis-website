from pydantic import BaseModel
from typing import List

class Word(BaseModel):
    id: int
    word: str
    guesses: List[str]
    guessed_ratio: float

class Story(BaseModel):
    name: str
    words: List[Word]