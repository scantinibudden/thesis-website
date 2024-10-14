from pydantic import BaseModel
from typing import List
from datetime import datetime

class Trial(BaseModel):
    trialId: str
    startTime: datetime
    submitTime: datetime
    storyName: str
    missingWordIds: List[int]
    guessedWords: List[str]
    
class Session(BaseModel):
    userId: str
    loginTime: datetime
    trials: List[Trial]
    hasFinished: bool
    isNew: bool