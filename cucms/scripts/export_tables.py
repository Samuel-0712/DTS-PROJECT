import sqlite3
import os

db_path = r"c:\Users\SAMUEL\Downloads\misc\cucms-frontend\cucms\cucms.db"
output_path = r"c:\Users\SAMUEL\Downloads\misc\cucms-frontend\cucms\database_visual_representation.md"

def export_to_markdown():
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get list of all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
    tables = [row[0] for row in cursor.fetchall()]

    # Sort tables so standard lookup/base tables appear first
    order_pref = ['cafeteria', 'user', 'student', 'staff_member', 'prepaid_account', 'menu_item', 'order', 'order_item', 'payment', 'prepaid_transaction']
    tables = sorted(tables, key=lambda x: order_pref.index(x) if x in order_pref else len(order_pref))

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("# TABLES (VISUAL REPRESENTATION OF CUCMS DATABASE)\n\n")
        f.write("This document provides a visual representation of all tables and seeded records inside the **CUCMS SQLite Database**.\n\n")

        for table in tables:
            f.write(f"## Table: {table}\n\n")
            
            # Get table schema (columns)
            cursor.execute(f'PRAGMA table_info("{table}");')
            columns_info = cursor.fetchall()
            headers = [col[1] for col in columns_info]

            # Get rows
            cursor.execute(f'SELECT * FROM "{table}";')
            rows = cursor.fetchall()

            if not rows:
                f.write("*Table is empty.*\n\n")
                continue

            # Generate markdown table
            header_str = " | ".join(headers)
            separator_str = " | ".join(["---"] * len(headers))
            f.write(f"| {header_str} |\n")
            f.write(f"| {separator_str} |\n")

            for row in rows:
                # Format cell values: display None as NULL, and clean up strings
                formatted_row = []
                for val in row:
                    if val is None:
                        formatted_row.append("`NULL`")
                    else:
                        formatted_row.append(str(val).replace("\n", " "))
                row_str = " | ".join(formatted_row)
                f.write(f"| {row_str} |\n")
            
            f.write("\n---\n\n")

    conn.close()
    print(f"Successfully exported visual representation to {output_path}")

if __name__ == "__main__":
    export_to_markdown()
