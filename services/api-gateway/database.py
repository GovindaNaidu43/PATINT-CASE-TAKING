from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from config import settings

connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
class Base(DeclarativeBase): pass

def migrate_sqlite_schema() -> None:
    if not settings.database_url.startswith("sqlite"):
        return
    inspector = inspect(engine)
    with engine.begin() as connection:
        tables = set(inspector.get_table_names())
        if "consultations" in tables:
            columns = {column["name"] for column in inspector.get_columns("consultations")}
            additions = {
                "status": "VARCHAR DEFAULT 'active'",
                "turns": "JSON DEFAULT '[]'",
                "red_flags": "JSON DEFAULT '[]'",
                "created_at": "DATETIME",
                "updated_at": "DATETIME",
            }
            for name, definition in additions.items():
                if name not in columns:
                    connection.exec_driver_sql(f"ALTER TABLE consultations ADD COLUMN {name} {definition}")
            connection.exec_driver_sql("UPDATE consultations SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")
            connection.exec_driver_sql("UPDATE consultations SET updated_at = created_at WHERE updated_at IS NULL")
        if "patients" in tables:
            columns = {column["name"] for column in inspector.get_columns("patients")}
            additions = {
                "age": "INTEGER",
                "gender": "VARCHAR(30)",
                "contact": "VARCHAR(40)",
                "blood_group": "VARCHAR(5)",
                "occupation": "VARCHAR(120)",
                "abha_id": "VARCHAR",
                "consent_granted": "BOOLEAN DEFAULT 0",
                "created_at": "DATETIME",
            }
            for name, definition in additions.items():
                if name not in columns:
                    connection.exec_driver_sql(f"ALTER TABLE patients ADD COLUMN {name} {definition}")
            connection.exec_driver_sql("UPDATE patients SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()
