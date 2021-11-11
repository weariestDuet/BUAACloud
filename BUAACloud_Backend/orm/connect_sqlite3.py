import sqlite3
import os


DATABASE = os.path.join(os.path.dirname(__file__), 'my_docker.db')


def connect_db():
    return sqlite3.connect(database=DATABASE)


def fetch_all(cursor, one=False):
    rv = [dict((cursor.description[idx][0], value) for idx, value in enumerate(row)) for row in cursor.fetchall()]
    if rv:
        return rv[0] if one else rv
    else:
        return None


if __name__ == '__main__':
    db = connect_db()
    cur = db.cursor()
    rv = cur.execute('select * from build_table')
    print(rv.fetchall())
