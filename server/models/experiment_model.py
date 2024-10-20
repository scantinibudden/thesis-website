from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Trial(BaseModel):
    trialId: str
    trialName: str
    startTime: datetime
    submitTime: datetime
    missingWordIds: List[int]
    missingWords: List[str]
    guessedWords: List[str]
    hasFinished: bool
    
class Session(BaseModel):
    userId: str
    loginTime: datetime
    trials: List[Trial] = []
    tutorialTime: Optional[datetime] = None
    is_new: bool = True