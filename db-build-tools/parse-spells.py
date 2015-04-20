import csv
import sqlite3

def getspells():
    spells = []
    with open('spells.csv', newline='') as csvfile:
        reader = csv.reader(csvfile)

        headings = reader.__next__()

        for row in reader:
            spell = {}
            #spellname
            spell["spellname"] = row[0].strip()
            #school
            #subschool
            spell["school"] = row[1].strip()
            spell["subschool"] = row[2].strip()
            #descriptors (columns 46(AT) - 70(BR)
            spell["descriptors"] = []
            for i in range(45, 70):
                if int(row[i]):
                    spell["descriptors"].append(headings[i])
            #classes/levels/caster_type (columns 27(AA) - 41(AO))
            spell["classes"] = {}
            for i in range(26, 41):
                if row[i].isdigit():
                    spell["classes"][headings[i]] = int(row[i])
            #domains
            spell["domains"] = []
            for d in row[43].split(', '):
                if not len(d.strip()) == 0:
                    spell["domains"].append(d.strip())
            #casting_time
            spell["casting_time"] = row[5].strip()
            #components
            spell["components"] = row[6].strip()
            #range
            spell["range"] = row[8].strip()
            #target
            spell["target"] = row[11].strip()
            #effect
            spell["effect"] = row[10].strip()
            #duration
            spell["duration"] =  row[12].strip()
            #saving_throw
            spell["saving_throw"] = row[15].strip()
            #spell_resistance
            spell["spell_resistance"] = row[16].strip()
            #description
            spell["description"] = row[17].strip()
            #short_description
            spell["short_description"] = row[44].strip()
            #resource
            spell["resource"] = row[19].strip()

            spells.append(spell)
    return spells

def makedb(inputList):
    conn = sqlite3.connect('spell-db-master.db')
    db = conn.cursor()

    db.execute("""PRAGMA foreign_keys = ON;""")
    conn.commit()
    db.executescript("""
        CREATE TABLE IF NOT EXISTS spells (
            spellname TEXT NOT NULL,
            casting_time TEXT NOT NULL,
            components TEXT,
            range TEXT,
            target TEXT,
            effect TEXT,
            duration TEXT,
            saving_throw TEXT,
            spell_resistance TEXT,
            description TEXT NOT NULL,
            short_description TEXT NOT NULL,
            resource TEXT NOT NULL,
            PRIMARY KEY(spellname));

        CREATE TABLE IF NOT EXISTS castinglevelbyclass (
            spellname TEXT NOT NULL,
            class TEXT NOT NULL,
            level INTEGER NOT NULL,
            FOREIGN KEY(spellname) REFERENCES spells(spellname),
            PRIMARY KEY(spellname, class));

        CREATE TABLE IF NOT EXISTS domains (
            spellname TEXT NOT NULL,
            domain TEXT NOT NULL,
            FOREIGN KEY(spellname) REFERENCES spells(spellname),
            PRIMARY KEY(spellname, domain));

        CREATE TABLE IF NOT EXISTS schools (
            spellname TEXT NOT NULL,
            school TEXT NOT NULL,
            subschool TEXT,
            FOREIGN KEY(spellname) REFERENCES spells(spellname),
            PRIMARY KEY(spellname, school));

        CREATE TABLE IF NOT EXISTS descriptors (
            spellname TEXT NOT NULL,
            descriptor TEXT NOT NULL,
            FOREIGN KEY(spellname) REFERENCES spells(spellname),
            PRIMARY KEY(spellname, descriptor));""")

    for item in inputList:
        db.execute("""
            INSERT INTO spells
                (spellname,
                casting_time,
                components,
                range,
                target,
                effect,
                duration,
                saving_throw,
                spell_resistance,
                description,
                short_description,
                resource)
            VALUES (:spellname, :casting_time, :components, :range,
                :target, :effect, :duration, :saving_throw, :spell_resistance,
                :description, :short_description, :resource)""", item)

        for k in item["classes"].keys():
            db.execute("""
                INSERT INTO castinglevelbyclass
                    (spellname, class, level)
                VALUES (?, ?, ?)""", (item["spellname"], k, item["classes"][k]))

        for d in item["domains"]:
            db.execute("""
                INSERT INTO domains
                    (spellname, domain)
                VALUES (?, ?)""", (item["spellname"], d))

        db.execute("""
            INSERT INTO schools
                (spellname, school, subschool)
            VALUES (:spellname, :school, :subschool)""", item)

        for d in item["descriptors"]:
            db.execute("""
                INSERT INTO descriptors
                    (spellname, descriptor)
                VALUES (?, ?)""", (item["spellname"], d))

    conn.commit()
    conn.close()

makedb(getspells())
