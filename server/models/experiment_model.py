from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Trial(BaseModel):
    trialId: str
    trialName: str
    startTime: Optional[datetime] = None
    submitTime: datetime
    missingWordIds: List[int]
    missingWords: List[str]
    guessedWords: List[str] = []
    guessTimestamps: List[datetime] = []
    hasFinished: bool = False
    
class Session(BaseModel):
    userId: str
    loginTime: datetime
    trials: List[Trial] = []
    tutorialTime: Optional[datetime] = None
    isNew: bool = True
