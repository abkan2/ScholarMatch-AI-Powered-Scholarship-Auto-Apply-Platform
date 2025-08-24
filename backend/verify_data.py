from database import SessionLocal
from models import User, Profile, Scholarship, Application
from sqlalchemy.orm import joinedload

def verify_data():
    db = SessionLocal()
    try:
        # Check Users and their Profiles
        print("\n=== Users and Profiles ===")
        users = db.query(User).options(joinedload(User.profile)).all()
        for user in users:
            print(f"\nUser: {user.full_name} ({user.email})")
            if user.profile:
                print(f"Profile:")
                print(f"  - University: {user.profile.university}")
                print(f"  - Major: {user.profile.major}")
                print(f"  - GPA: {user.profile.gpa}")
                print(f"  - Graduation Year: {user.profile.graduation_year}")
            else:
                print("No profile found for this user")

        # Check Scholarships
        print("\n=== Scholarships ===")
        scholarships = db.query(Scholarship).all()
        print(f"\nTotal Scholarships: {len(scholarships)}")
        for scholarship in scholarships:
            print(f"\nScholarship: {scholarship.title}")
            print(f"Amount: ${scholarship.amount:,}")
            print(f"Deadline: {scholarship.deadline.strftime('%Y-%m-%d')}")
            print(f"Requirements: {scholarship.requirements}")

        # Check Applications (if any)
        print("\n=== Applications ===")
        applications = db.query(Application).options(
            joinedload(Application.user),
            joinedload(Application.scholarship)
        ).all()
        
        if applications:
            print(f"\nTotal Applications: {len(applications)}")
            for app in applications:
                print(f"\nApplication:")
                print(f"User: {app.user.full_name}")
                print(f"Scholarship: {app.scholarship.title}")
                print(f"Status: {app.status}")
                print(f"Submitted: {app.submitted_at}")
        else:
            print("No applications found in the database")

    except Exception as e:
        print(f"Error during verification: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_data()
