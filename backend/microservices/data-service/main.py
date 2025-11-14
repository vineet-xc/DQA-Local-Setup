from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging
import random
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DQA Data Service",
    description="Data Processing and Analytics Microservice",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class AnalyticsData(BaseModel):
    metric_name: str
    value: float
    timestamp: datetime
    category: str

class ReportRequest(BaseModel):
    report_type: str
    date_range: Dict[str, str]
    filters: Optional[Dict[str, Any]] = None

class ReportResponse(BaseModel):
    report_id: str
    report_type: str
    generated_at: datetime
    data: Dict[str, Any]

class MetricsResponse(BaseModel):
    total_users: int
    active_sessions: int
    daily_transactions: int
    system_uptime: float
    response_time_avg: float

# Sample data generation functions
def generate_sample_analytics() -> List[AnalyticsData]:
    """Generate sample analytics data"""
    categories = ["user_activity", "system_performance", "business_metrics", "security"]
    metrics = {
        "user_activity": ["page_views", "user_logins", "session_duration"],
        "system_performance": ["cpu_usage", "memory_usage", "disk_usage"],
        "business_metrics": ["revenue", "conversion_rate", "customer_satisfaction"],
        "security": ["failed_logins", "security_alerts", "blocked_requests"]
    }
    
    data = []
    for category in categories:
        for metric in metrics[category]:
            data.append(AnalyticsData(
                metric_name=metric,
                value=round(random.uniform(10, 100), 2),
                timestamp=datetime.utcnow() - timedelta(hours=random.randint(0, 24)),
                category=category
            ))
    
    return data

def generate_dashboard_metrics() -> MetricsResponse:
    """Generate sample dashboard metrics"""
    return MetricsResponse(
        total_users=random.randint(1000, 5000),
        active_sessions=random.randint(50, 200),
        daily_transactions=random.randint(500, 2000),
        system_uptime=round(random.uniform(95.0, 99.9), 2),
        response_time_avg=round(random.uniform(0.1, 2.0), 3)
    )

def generate_chart_data(chart_type: str) -> Dict[str, Any]:
    """Generate sample chart data"""
    if chart_type == "line":
        return {
            "labels": [f"Day {i+1}" for i in range(7)],
            "datasets": [{
                "label": "User Activity",
                "data": [random.randint(100, 500) for _ in range(7)],
                "borderColor": "rgb(75, 192, 192)",
                "tension": 0.1
            }]
        }
    elif chart_type == "bar":
        return {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            "datasets": [{
                "label": "Monthly Revenue",
                "data": [random.randint(1000, 5000) for _ in range(6)],
                "backgroundColor": "rgba(54, 162, 235, 0.5)"
            }]
        }
    elif chart_type == "pie":
        return {
            "labels": ["Desktop", "Mobile", "Tablet"],
            "datasets": [{
                "data": [random.randint(20, 60), random.randint(20, 60), random.randint(10, 30)],
                "backgroundColor": [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 205, 86, 0.5)"
                ]
            }]
        }
    else:
        return {"error": "Unsupported chart type"}

@app.get("/")
async def root():
    return {"message": "DQA Data Service", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "data-service"}

@app.get("/analytics", response_model=List[AnalyticsData])
async def get_analytics(
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, description="Limit number of results")
):
    """Get analytics data with optional filtering"""
    data = generate_sample_analytics()
    
    if category:
        data = [item for item in data if item.category == category]
    
    # Sort by timestamp (most recent first)
    data.sort(key=lambda x: x.timestamp, reverse=True)
    
    logger.info(f"Retrieved {len(data[:limit])} analytics records")
    return data[:limit]

@app.get("/metrics", response_model=MetricsResponse)
async def get_dashboard_metrics():
    """Get current dashboard metrics"""
    metrics = generate_dashboard_metrics()
    logger.info("Generated dashboard metrics")
    return metrics

@app.get("/charts/{chart_type}")
async def get_chart_data(chart_type: str):
    """Get chart data for different visualization types"""
    supported_types = ["line", "bar", "pie"]
    
    if chart_type not in supported_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Chart type '{chart_type}' not supported. Use: {', '.join(supported_types)}"
        )
    
    chart_data = generate_chart_data(chart_type)
    logger.info(f"Generated {chart_type} chart data")
    return chart_data

@app.post("/reports", response_model=ReportResponse)
async def generate_report(request: ReportRequest):
    """Generate a data report based on request parameters"""
    report_id = f"report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{random.randint(1000, 9999)}"
    
    # Sample report data based on type
    if request.report_type == "user_activity":
        report_data = {
            "summary": {
                "total_users": random.randint(1000, 5000),
                "active_users": random.randint(500, 2500),
                "new_users": random.randint(50, 200)
            },
            "daily_breakdown": [
                {
                    "date": (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d"),
                    "logins": random.randint(100, 500),
                    "page_views": random.randint(1000, 5000)
                }
                for i in range(7)
            ]
        }
    elif request.report_type == "system_performance":
        report_data = {
            "summary": {
                "avg_response_time": round(random.uniform(0.1, 2.0), 3),
                "uptime_percentage": round(random.uniform(95.0, 99.9), 2),
                "error_rate": round(random.uniform(0.1, 5.0), 2)
            },
            "hourly_stats": [
                {
                    "hour": i,
                    "cpu_usage": round(random.uniform(20, 80), 2),
                    "memory_usage": round(random.uniform(30, 90), 2),
                    "requests": random.randint(100, 1000)
                }
                for i in range(24)
            ]
        }
    else:
        report_data = {
            "message": f"Report type '{request.report_type}' not implemented yet",
            "available_types": ["user_activity", "system_performance"]
        }
    
    report = ReportResponse(
        report_id=report_id,
        report_type=request.report_type,
        generated_at=datetime.utcnow(),
        data=report_data
    )
    
    logger.info(f"Generated report: {report_id}")
    return report

@app.get("/reports")
async def list_reports():
    """List available reports"""
    return {
        "available_reports": [
            {
                "type": "user_activity",
                "description": "User engagement and activity metrics",
                "parameters": ["date_range"]
            },
            {
                "type": "system_performance", 
                "description": "System performance and uptime metrics",
                "parameters": ["date_range"]
            },
            {
                "type": "business_metrics",
                "description": "Business KPIs and revenue metrics",
                "parameters": ["date_range", "filters"]
            }
        ]
    }

@app.get("/export/{format}")
async def export_data(
    format: str,
    data_type: str = Query(..., description="Type of data to export"),
    date_range: Optional[str] = Query(None, description="Date range filter")
):
    """Export data in different formats (JSON, CSV, etc.)"""
    supported_formats = ["json", "csv"]
    
    if format not in supported_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Format '{format}' not supported. Use: {', '.join(supported_formats)}"
        )
    
    # Generate sample export data
    if data_type == "analytics":
        data = generate_sample_analytics()
        export_data = [item.dict() for item in data]
    elif data_type == "metrics":
        metrics = generate_dashboard_metrics()
        export_data = metrics.dict()
    else:
        raise HTTPException(status_code=400, detail=f"Data type '{data_type}' not supported")
    
    logger.info(f"Exported {data_type} data in {format} format")
    
    if format == "json":
        return {"format": "json", "data": export_data}
    elif format == "csv":
        # In a real implementation, you would convert to CSV format
        return {"format": "csv", "message": "CSV export would be implemented here", "data": export_data}

@app.get("/realtime/metrics")
async def get_realtime_metrics():
    """Get real-time system metrics"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "metrics": {
            "active_connections": random.randint(10, 100),
            "requests_per_second": random.randint(50, 500),
            "cpu_usage": round(random.uniform(20, 80), 2),
            "memory_usage": round(random.uniform(30, 90), 2),
            "disk_io": round(random.uniform(10, 100), 2)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003, reload=True)