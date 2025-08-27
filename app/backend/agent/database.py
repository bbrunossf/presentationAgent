# database.py
import os
import sqlite3
import pg8000
from typing import List, Dict, Any


class Database:
    """Interface base para acesso a bancos de dados."""
    def query(self, query: str) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def close(self):
        pass


class SQLiteDatabase(Database):
    def __init__(self, db_path: str):
        self.db_path = db_path

    def query(self, query: str) -> List[Dict[str, Any]]:
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(query)
            results = [dict(row) for row in cursor.fetchall()]
            conn.close()
            return results
        except sqlite3.Error as e:
            return [{"error": str(e)}]


class PostgresDatabase(Database):
    def __init__(self, host: str, dbname: str, user: str, password: str, port: int = 5432):
        self.conn = pg8000.connect(
            host=host, database=dbname, user=user, password=password, port=port
        )

    def query(self, query: str) -> List[Dict[str, Any]]:
        try:
            cursor = self.conn.cursor()
            cursor.execute(query)
            columns = [desc[0] for desc in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            cursor.close()
            return results
        except pg8000.Error as e:
            return [{"error": str(e)}]

    def close(self):
        if self.conn:
            self.conn.close()


def get_database() -> Database:
    """Factory que escolhe o banco com base em variáveis de ambiente."""
    db_type = os.environ.get("DB_TYPE", "sqlite").lower()

    if db_type == "postgres":
        return PostgresDatabase(
            host=os.environ.get("DB_HOST", "localhost"),
            dbname=os.environ.get("DB_NAME", "plena"),
            user=os.environ.get("DB_USER", "user"),
            password=os.environ.get("DB_PASSWORD", "senha"),
            port=int(os.environ.get("DB_PORT", 5432)),
        )
    else:
        db_path = os.environ.get("DB_PATH", "database.sqlite")
        return SQLiteDatabase(db_path)
