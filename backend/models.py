from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    platform = Column(String(20), nullable=False)  # 'facebook', 'instagram', 'both'
    post_type = Column(String(50), nullable=False)  # 'educational', 'promotional', 'customer_story', 'seasonal'
    tone = Column(String(50))  # 'professional', 'friendly', 'urgent', 'educational'
    target_audience = Column(String(50))  # 'individual_owners', 'fleet_managers', 'shop_owners'
    topic = Column(String(100))  # e.g., 'ECU repair vs replacement'
    season = Column(String(20))  # 'winter', 'spring', 'summer', 'fall'
    created_at = Column(DateTime, default=datetime.utcnow)
    published_at = Column(DateTime)
    scheduled_at = Column(DateTime)
    rating = Column(Integer)  # 1-5 stars
    inquiries_count = Column(Integer, default=0)
    notes = Column(Text)
    hashtags = Column(Text)  # JSON string of hashtags
    prompt_used = Column(Text)  # Store prompt for analysis
    visual_suggestions = Column(Text)
    call_to_action = Column(Text)
    is_favorite = Column(Integer, default=0)  # Boolean as integer
    length = Column(String(20))  # 'short', 'medium', 'long'

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'platform': self.platform,
            'post_type': self.post_type,
            'tone': self.tone,
            'target_audience': self.target_audience,
            'topic': self.topic,
            'season': self.season,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'scheduled_at': self.scheduled_at.isoformat() if self.scheduled_at else None,
            'rating': self.rating,
            'inquiries_count': self.inquiries_count,
            'notes': self.notes,
            'hashtags': self.hashtags,
            'prompt_used': self.prompt_used,
            'visual_suggestions': self.visual_suggestions,
            'call_to_action': self.call_to_action,
            'is_favorite': self.is_favorite,
            'length': self.length,
            'effectiveness_score': self.calculate_effectiveness_score()
        }

    def calculate_effectiveness_score(self):
        """Calculate effectiveness score based on rating and inquiries"""
        if not self.rating:
            return 0
        # Formula: (rating * 20) + (inquiries * 10)
        # Max rating of 5 = 100 points, each inquiry = 10 points
        return (self.rating * 20) + (self.inquiries_count * 10)


# Database setup
def init_db(db_url='sqlite:///database.db'):
    """Initialize database"""
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    return Session()


def get_session():
    """Get database session"""
    db_url = os.getenv('DATABASE_URL', 'sqlite:///database.db')
    engine = create_engine(db_url)
    Session = sessionmaker(bind=engine)
    return Session()
