
from flask import Flask, request, jsonify, redirect, url_for, render_template, session, flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
CORS(app)  

def init_db():
    """Initialize the database and create tables if they don't exist"""
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
   
    c.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            github_url TEXT,
            live_url TEXT,
            technologies TEXT
        )
    ''')
    
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('SELECT * FROM projects')
    projects = c.fetchall()
    
    
    project_list = []
    for project in projects:
        project_dict = {
            'id': project[0],
            'title': project[1],
            'description': project[2],
            'image_url': project[3],
            'github_url': project[4],
            'live_url': project[5],
            'technologies': project[6].split(',') if project[6] else []
        }
        project_list.append(project_dict)
    
    conn.close()
    return jsonify(project_list)

@app.route('/api/projects', methods=['POST'])
def add_project():
    """Add a new project"""
    data = request.json
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO projects (title, description, image_url, github_url, live_url, technologies)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['title'],
        data['description'],
        data.get('image_url'),
        data.get('github_url'),
        data.get('live_url'),
        ','.join(data.get('technologies', []))
    ))
    
    conn.commit()
    project_id = c.lastrowid
    conn.close()
    
    return jsonify({'id': project_id, 'message': 'Project added successfully'}), 201

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Submit a contact form message"""
    data = request.json
    
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO contact_messages (name, email, message)
        VALUES (?, ?, ?)
    ''', (data['name'], data['email'], data['message']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Message sent successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
