import sqlite3

def database():
    with sqlite3.connect('database.db') as con:
        cur = con.cursor()

        return con, cur

def table_creation():
    con = None
    try:
        con, cur = database()
        cur.execute("""Create Table IF NOT EXISTS password_manager 
                    (id INTEGER PRIMARY KEY,
                    website TEXT NOT NULL,
                    website_url TEXT NOT NULL,
                    password_hashed TEXT NOT NULL,
                    email TEXT NOT NULL)""")
        con.commit()

    except sqlite3.Error as e:
        print(f"An error occurred while creating the table: {e}")
    finally:
        if con:
            con.close()

def insertion(website, url, password_hashed, email):
    con = None
    try:
        con, cur = database()
        cur.execute("INSERT INTO password_manager (website, website_url, password_hashed, email) VALUES (?, ?, ?, ?)", 
                    (website, url, password_hashed, email))
        con.commit()

    except sqlite3.Error as e:
        print(f"An error occurred while creating the table: {e}")
    finally:
        if con:
            con.close()

def get_all_passwords():
    con = None
    try:
        con, cur = database()
        cur.execute("SELECT * FROM password_manager")
        rows = cur.fetchall()
        return rows    
    except sqlite3.Error as e:
        print(f"An error occurred while creating the table: {e}")
        return []
    finally:
        if con:
            con.close()

def delete(task_id):
    con = None
    try:
        con, cur = database()
        cur.execute("SELECT * FROM password_manager WHERE id = ?", (task_id,))
        row = cur.fetchone()
        if not row:
            print("no data found with relate id number")
        else:
            cur.execute("DELETE FROM password_manager WHERE id = ?", (task_id,))
            print(f"{row} deleted successfully")
            con.commit()
    except sqlite3.Error as e:
            print(f"An error occurred while creating the table: {e}")
    finally:
        if con:
            con.close()


def update(id, website = None, url = None, password_hashed = None, email = None):
    con = None
    try:
        con, cur = database()
        cur.execute("SELECT * FROM password_manager WHERE id = ?", (id,))
        row = cur.fetchone()
        if not row:
            print("no data found with relate id number")
        else: 
            print(row)

            feilds =[]
            values = []

            if website is not None:
                feilds.append("website = ?")
                values.append(website)
            if url is not None:
                feilds.append("website_url = ?")
                values.append(url)
            if password_hashed is not None:
                feilds.append("password_hashed = ?")
                values.append(password_hashed)
            if email is not None:
                feilds.append("email = ?")
                values.append(email)

            if not feilds:
                print("nothing to update.")
                return

            values.append(id)

            query = f"UPDATE password_manager SET {' ,'.join(feilds)} WHERE id = ?"
            cur.execute(query, values)
            con.commit()
            cur.execute("SELECT * FROM password_manager WHERE id = ?", (id,))
            new_row = cur.fetchone()
            print(f"successfully updated \n {new_row}")

    except sqlite3.Error as e:
        print(f"An error occured while creating the table: {e}")
    finally:
        if con:
            con.close()
    