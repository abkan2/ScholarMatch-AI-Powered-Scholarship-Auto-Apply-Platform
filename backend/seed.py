import csv
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User, Profile, Scholarship, Application

def seed_scholarships_from_csv():
    db = SessionLocal()
    try:
        # Read from CSV file
        csv_path = os.path.join(os.path.dirname(__file__), 'sample_scholarships.csv')
        with open(csv_path, 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                scholarship = Scholarship(
                    title=row['title'],
                    description=row['description'],
                    amount=int(row['amount']),
                    deadline=datetime.strptime(row['deadline'], '%Y-%m-%d'),
                    requirements=row['requirements']
                )
                db.add(scholarship)
        db.commit()
        print("✅ Successfully seeded scholarships from CSV")
    except Exception as e:
        print(f"❌ Error seeding scholarships: {str(e)}")
        db.rollback()
    finally:
        db.close()

def create_sample_data():
    db = SessionLocal()
    try:
        # Create sample users with profiles
        users_data = [
            {
                "email": "john@example.com",
                "full_name": "John Doe",
                "hashed_password": "hashed_password_1",
                "profile": {
                    "gpa": 3.8,
                    "major": "Computer Science",
                    "university": "Stanford University",
                    "graduation_year": 2025
                }
            },
            {
                "email": "jane@example.com",
                "full_name": "Jane Smith",
                "hashed_password": "hashed_password_2",
                "profile": {
                    "gpa": 3.9,
                    "major": "Biology",
                    "university": "Harvard University",
                    "graduation_year": 2024
                }
            }
        ]

        for user_data in users_data:
            profile_data = user_data.pop('profile')
            user = User(**user_data)
            db.add(user)
            db.flush()  # Flush to get user.id
            
            profile = Profile(user_id=user.id, **profile_data)
            db.add(profile)

        # Create sample scholarships if CSV doesn't exist
        sample_scholarships = [
            {
                "title": "STEM Excellence Scholarship",
                "description": "For outstanding students in STEM fields",
                "amount": 5000,
                "deadline": datetime.now() + timedelta(days=90),
                "requirements": "Must be a STEM major with GPA > 3.5"
            },
            {
                "title": "Future Leaders Grant",
                "description": "Supporting tomorrow's leaders in any field",
                "amount": 3000,
                "deadline": datetime.now() + timedelta(days=60),
                "requirements": "Leadership experience required"
            }
        ]

        for scholarship_data in sample_scholarships:
            scholarship = Scholarship(**scholarship_data)
            db.add(scholarship)

        db.commit()
        print("✅ Successfully created sample data")
    except Exception as e:
        print(f"❌ Error creating sample data: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # First try to seed from CSV
    if os.path.exists(os.path.join(os.path.dirname(__file__), 'sample_scholarships.csv')):
        seed_scholarships_from_csv()
    else:
        # If no CSV exists, create sample data
        create_sample_data()
