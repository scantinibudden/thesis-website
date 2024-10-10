from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Trial(BaseModel):
    trialNumber: int
    wordID: int
    meaningID: int
    word: str
    context: str
    answers: List[str]
    wordOrder: List[str]
    startTime: datetime
    submitTime: datetime

class Session(BaseModel):
    userId: str
    loginTime: datetime
    tutorialTime: Optional[datetime] = None
    trials: List[Trial]
    lastTrialSubmitted: Optional[int] = None
    hasFinished: bool
    isNew: bool
