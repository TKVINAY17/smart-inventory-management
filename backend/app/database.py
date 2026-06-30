from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import DATABASE_URL

print("Database URL:", DATABASE_URL)

engine = create_engine(DATABASE_URL)

# Test the connection
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        print("✅ Connected to PostgreSQL successfully!")
except Exception as e:
    print("❌ Database connection failed:")
    print(e)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()