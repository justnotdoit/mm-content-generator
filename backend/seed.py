"""
Seed script to populate database with sample posts for testing
"""
from models import Post, init_db, get_session
from datetime import datetime, timedelta
import json
import random

def seed_database():
    """Add sample posts to database"""
    session = get_session()

    # Clear existing posts (optional - comment out if you want to keep existing data)
    # session.query(Post).delete()
    # session.commit()

    sample_posts = [
        {
            'content': "❄️ Calgary winters are tough on your car's electronics! Did you know cold temperatures can affect your ECU's performance? Our mobile service comes to YOU for free diagnostics. Don't let winter slow you down! #YYCAutoRepair #CalgaryWinter",
            'platform': 'instagram',
            'post_type': 'seasonal',
            'tone': 'friendly',
            'target_audience': 'individual_owners',
            'topic': 'ECU winter performance',
            'season': 'winter',
            'rating': 5,
            'inquiries_count': 8,
            'notes': 'Excellent response! Many calls about ECU issues.',
            'hashtags': json.dumps(['#YYCAutoRepair', '#CalgaryWinter', '#ECURepair', '#WinterCarCare', '#YYC', '#Calgary', '#AutoRepair', '#MobileCarRepair']),
            'visual_suggestions': 'Car in snow with diagnostic tool',
            'call_to_action': 'Call for free winter diagnostics!',
            'length': 'medium',
            'published_at': datetime.now() - timedelta(days=10)
        },
        {
            'content': "💡 REPAIR vs REPLACE: Why Module Masters saves you thousands!\n\nDealership quote: Replace ECU - $2,500 ✗\nModule Masters: Repair ECU - $450 ✓\n\nWith 20+ years experience, we repair first, replace only when necessary. Your wallet will thank you!\n\nCall today: Free diagnosis on all modules.\n\n#RepairNotReplace #YYCAutoRepair #SaveMoney",
            'platform': 'facebook',
            'post_type': 'educational',
            'tone': 'professional',
            'target_audience': 'individual_owners',
            'topic': 'Repair vs replacement cost comparison',
            'season': 'winter',
            'rating': 5,
            'inquiries_count': 12,
            'notes': 'Huge success! People love the cost comparison.',
            'hashtags': json.dumps(['#RepairNotReplace', '#YYCAutoRepair', '#SaveMoney', '#CalgaryAuto']),
            'visual_suggestions': 'Side-by-side cost comparison graphic',
            'call_to_action': 'Call today for free diagnosis',
            'length': 'medium',
            'published_at': datetime.now() - timedelta(days=8)
        },
        {
            'content': "🚗 Success Story: 2018 BMW X5 wouldn't start in -25°C weather. Dealership said: \"Replace FRM module - $1,800\"\n\nWe diagnosed it at the customer's driveway (mobile service!) and repaired the FRM for $525. Customer back on the road same day.\n\nThis is what 20 years of experience looks like. #YYCBusiness #BMWRepair",
            'platform': 'facebook',
            'post_type': 'customer_story',
            'tone': 'friendly',
            'target_audience': 'individual_owners',
            'topic': 'BMW FRM module repair',
            'season': 'winter',
            'rating': 4,
            'inquiries_count': 5,
            'notes': 'Good engagement, several BMW owners reached out',
            'hashtags': json.dumps(['#YYCBusiness', '#BMWRepair', '#FRMRepair', '#CalgaryAuto']),
            'visual_suggestions': 'Photo of BMW and happy customer (with permission)',
            'call_to_action': 'Contact us for mobile diagnostics',
            'length': 'long',
            'published_at': datetime.now() - timedelta(days=5)
        },
        {
            'content': "⚠️ WARNING: Your airbag light shouldn't be ignored! After an accident or even a minor bump, your airbag module may need attention. We specialize in airbag module repair and reset - keeping you safe without dealership prices. #CarSafety #YYCAutoRepair",
            'platform': 'instagram',
            'post_type': 'educational',
            'tone': 'urgent',
            'target_audience': 'individual_owners',
            'topic': 'Airbag module safety',
            'season': 'winter',
            'rating': 4,
            'inquiries_count': 6,
            'notes': 'Good awareness post, several safety-conscious customers called',
            'hashtags': json.dumps(['#CarSafety', '#YYCAutoRepair', '#AirbagRepair', '#AutoSafety', '#Calgary', '#YYC', '#AirbagModule', '#CarMaintenance']),
            'visual_suggestions': 'Airbag warning light on dashboard',
            'call_to_action': 'Get your airbag system checked today',
            'length': 'short',
            'published_at': datetime.now() - timedelta(days=3)
        },
        {
            'content': "🎉 FLEET MANAGERS: Special Winter Package!\n\nManaging 10+ vehicles? We've got you covered:\n✅ Priority mobile service\n✅ 15% fleet discount\n✅ Preventive maintenance program\n✅ Detailed reporting for each vehicle\n\nReduce downtime, reduce costs. That's the Module Masters difference.\n\nBook your fleet assessment: modulemasters.ca\n\n#FleetManagement #YYCBusiness #Calgary",
            'platform': 'facebook',
            'post_type': 'promotional',
            'tone': 'professional',
            'target_audience': 'fleet_managers',
            'topic': 'Fleet maintenance packages',
            'season': 'winter',
            'rating': 5,
            'inquiries_count': 15,
            'notes': 'Excellent! Got 3 fleet contracts from this post.',
            'hashtags': json.dumps(['#FleetManagement', '#YYCBusiness', '#Calgary', '#FleetMaintenance']),
            'visual_suggestions': 'Multiple vehicles or fleet graphic',
            'call_to_action': 'Book your fleet assessment at modulemasters.ca',
            'length': 'long',
            'published_at': datetime.now() - timedelta(days=15)
        },
        {
            'content': "🔧 ABS light on? In Calgary winter, your ABS is CRITICAL for safe driving on ice and snow. Don't ignore it! We diagnose and repair ABS modules quickly - often same day. Mobile service available! #ABSRepair #YYCAutoRepair #WinterSafety",
            'platform': 'instagram',
            'post_type': 'seasonal',
            'tone': 'urgent',
            'target_audience': 'individual_owners',
            'topic': 'ABS module winter importance',
            'season': 'winter',
            'rating': 4,
            'inquiries_count': 7,
            'notes': 'Good winter-specific post',
            'hashtags': json.dumps(['#ABSRepair', '#YYCAutoRepair', '#WinterSafety', '#CalgaryWinter', '#YYC', '#AutoRepair', '#BrakeSafety', '#WinterDriving']),
            'visual_suggestions': 'Car sliding on ice with ABS graphic',
            'call_to_action': 'Call now for ABS diagnostics',
            'length': 'short',
            'published_at': datetime.now() - timedelta(days=12)
        },
        {
            'content': "Did you know? Your car's BCM (Body Control Module) controls everything from power windows to door locks to interior lights. When it fails, multiple systems can go haywire! We repair BCM modules from all makes - BMW, Ford, Toyota, you name it. Expert diagnosis, honest pricing. #BCMRepair #YYCAutoRepair",
            'platform': 'facebook',
            'post_type': 'educational',
            'tone': 'educational',
            'target_audience': 'individual_owners',
            'topic': 'BCM module functions',
            'season': 'winter',
            'rating': 3,
            'inquiries_count': 4,
            'notes': 'Moderate engagement, educational posts need more hook',
            'hashtags': json.dumps(['#BCMRepair', '#YYCAutoRepair', '#AutoElectronics', '#Calgary']),
            'visual_suggestions': 'BCM module component photo',
            'call_to_action': 'Contact us for BCM diagnostics',
            'length': 'medium',
            'published_at': datetime.now() - timedelta(days=6)
        },
        {
            'content': "Spring is coming! 🌸 Time to check your vehicle after harsh Calgary winter. Our spring maintenance special includes full electronic system diagnostics. Book now and get ready for summer road trips! #SpringMaintenance #YYCAutoRepair",
            'platform': 'instagram',
            'post_type': 'seasonal',
            'tone': 'friendly',
            'target_audience': 'individual_owners',
            'topic': 'Spring maintenance',
            'season': 'spring',
            'rating': None,  # Not yet published/rated
            'inquiries_count': 0,
            'notes': None,
            'hashtags': json.dumps(['#SpringMaintenance', '#YYCAutoRepair', '#Calgary', '#SpringCarCheck', '#YYC', '#AutoMaintenance']),
            'visual_suggestions': 'Spring flowers with car in background',
            'call_to_action': 'Book your spring checkup today',
            'length': 'short',
            'scheduled_at': datetime.now() + timedelta(days=30)  # Scheduled for future
        }
    ]

    for post_data in sample_posts:
        post = Post(**post_data)
        session.add(post)

    session.commit()
    print(f"✅ Successfully added {len(sample_posts)} sample posts to database!")

    # Show summary
    all_posts = session.query(Post).all()
    rated_posts = [p for p in all_posts if p.rating is not None]
    print(f"\nDatabase summary:")
    print(f"Total posts: {len(all_posts)}")
    print(f"Rated posts: {len(rated_posts)}")
    print(f"Scheduled posts: {len([p for p in all_posts if p.scheduled_at and not p.published_at])}")


if __name__ == '__main__':
    print("Seeding database with sample posts...")
    init_db()
    seed_database()
