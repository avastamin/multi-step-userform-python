import os
from flask import Flask, render_template,request, json, redirect
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, User
from werkzeug.utils import secure_filename

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, 'static/uploads')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Connect to Database and create database session
engine = create_engine('sqlite:///user_profile.db')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()

def allowed_file(filename):
    # check if filename match with allowed extension
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/uploadimage", methods=['POST'])
def saveImage():
    if request.method == 'POST' and 'file' in request.files:
        userid = int(request.form['user_id'])
        
        # check if the post request has the file part
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            session.query(User).filter(User.id == userid).update({"picture": filename})
            session.commit()
            return filename
    else:
        return redirect(request.url)

@app.route('/savedata', methods=['POST'])
def save_user_data():
    if request.method == 'POST':
        post = json.loads(request.data)
        newUser = User(name=post['name'], email=post['email'],
                       phone=post['phone'])
        session.add(newUser)
        session.commit()
        return str(newUser.id)
    else:
        return redirect(request.url)

if __name__ == "__main__":
    app.secret_key = 'super_secret_key'
    app.config['SESSION_TYPE'] = 'filesystem'
    app.run(debug=True)
    #app.run()
