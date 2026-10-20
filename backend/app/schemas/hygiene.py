from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class ChecklistItem(BaseModel):
    id: str
    category: str
    item: str
    passed: bool
    notes: Optional[str] = ""

class VisibleHygieneMetric(BaseModel):
    metric_name: str
    score: float  # 0 to 100
    status: str  # "Compliant", "Needs Attention", "Non-Compliant"
    observation: str

class VideoFrameAnalysis(BaseModel):
    frame_number: int
    timestamp_sec: float
    score: float
    flags: List[str]

class KitchenHygieneResponse(BaseModel):
    id: str
    timestamp: str
    source_type: str  # "image" or "video"
    filename: str
    overall_hygiene_score: float  # 0 to 100
    status: str  # "Grade A - Excellent", "Grade B - Satisfactory", "Grade C - Needs Action"
    confidence: float
    facility_zone: str
    visible_metrics: List[VisibleHygieneMetric]
    video_frames_sampled: Optional[int] = 0
    frame_analyses: Optional[List[VideoFrameAnalysis]] = []
    manual_checklist: List[ChecklistItem]
    actionable_recommendations: List[str]
    compliance_disclaimer: str = (
        "HYGIENE AUDIT NOTICE: Optical inspection only measures visible surface order, spills, and debris. "
        "It DOES NOT evaluate bacterial pathogen levels, sanitization chemical contact times, or official local health department regulatory compliance."
    )
    inference_mode: str = "kitchen_vision_audit"
