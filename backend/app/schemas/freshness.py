from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class VisualIndicator(BaseModel):
    indicator: str
    status: str  # e.g., "Optimal", "Acceptable", "Degraded", "Caution"
    score: float  # 0 to 100
    details: str

class SpoilageSign(BaseModel):
    sign: str
    severity: str  # "Low", "Moderate", "High", "Critical"
    description: str

class FreshnessAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    filename: str
    item_name: str
    category: str
    freshness_score: float  # 0 to 100
    status: str  # "Fresh", "Consume Soon", "Spoilage Likely"
    confidence: float
    estimated_shelf_life_days: int
    visual_indicators: List[VisualIndicator]
    spoilage_signs: List[SpoilageSign] = []
    storage_recommendation: str
    safety_disclaimer: str = (
        "CRITICAL FOOD SAFETY NOTICE: Visual analysis is an AI estimate based solely on surface optical properties. "
        "It CANNOT detect odorless bacterial toxins, salmonella, E. coli, botulinum, chemical contaminants, or internal rot. "
        "Never consume food that smells off, has abnormal texture, or exceeds safe food-safety timeframes regardless of visual score."
    )
    inference_mode: str = "multispectral_cv_engine"
