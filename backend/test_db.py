from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, Application, Scholarship
import datetime

def test_database():
    try:
        # Create a new session
        db = SessionLocal()
        
        # Create a test user
        test_user = User(
            email="test@example.com",
            hashed_password="test_password_hash",
            full_name="Test User"
        )
        
        # Add and commit the test user
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        print("✅ Successfully created test user with ID:", test_user.id)
        
        # Query the user back
        queried_user = db.query(User).filter(User.email == "test@example.com").first()
        print("✅ Successfully queried user:", queried_user.full_name)
        
        # Clean up - delete the test user
        db.delete(queried_user)
        db.commit()
        print("✅ Successfully deleted test user")
        
        print("\nAll database operations completed successfully! Database is working properly.")
        
    except Exception as e:
        print("❌ Error:", str(e))
    finally:
        db.close()

if __name__ == "__main__":
    test_database()
