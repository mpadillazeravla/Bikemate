"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Group, Comment
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import json
import bcrypt
from bcrypt import hashpw
# para instalar paquete de bcrypt, para pass encriptado, instalar:
# pipenv install py-bcrypt
# pipenv install flask-jwt-extended

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#ruta protegida
@api.route("/profile", methods=["GET"])
@jwt_required() 
def protected():
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        return jsonify(user.serialize()) , 200


#crear usuario
@api.route("/register", methods=["POST"])
def create_user():
    body = json.loads(request.data)

    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"msg": "Usuario duplicado"}), 401 

    if not body["email"] or not body["password"] or not body["name"]:
        return jsonify({"msg": "Datos incorrectos"}), 404 

    hashed = bcrypt.hashpw(body["password"], bcrypt.gensalt())
    user = User(email=body["email"], password=hashed, name=body["name"])
    

    # user = User(email=body["email"], password=body["password"], is_active=True)
    db.session.add(user)
    db.session.commit()

    response_body={
        "msg": "usuario creado"
    }
    # return jsonify(response_body), 200
    access_token = create_access_token(identity=body["email"])
    return jsonify(access_token=access_token), 200   



#crear grupo
@api.route("/new_group", methods=["POST"])
def create_group():
    body = json.loads(request.data)

    if Group.query.filter_by(name=body["name"]).first():
        return jsonify({"msg": "Grupo ya existente"}), 401 

    if not body["name"] or not body["city"] or not body["speed"] or not body["distance"]:
        return jsonify({"msg": "Name, City, Speed & Distance required"}), 404 

    
    group = Group(name=body["name"], city=body["city"], speed=body["speed"], distance=body["distance"])

    # user = User(email=body["email"], password=body["password"], is_active=True)
    db.session.add(group)
    db.session.commit()

    # response_body={
    #     "msg": "Grupo creado"
    # }
    return jsonify(group.serialize()), 200
    
   

#login
@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()

    # esto esta puesto para que compruebe si los datos no son correctos
    # si no ponia este if, el fetch fallaba ya que USER no estaba creado
    # entonces estaba comparando el mail con el mail de user (que no existe)
    if not user :
        return jsonify({"msg": "datos incorrectos"}), 401


    # if email != user.email or password != user.password:
    if email != user.email or not bcrypt.checkpw(password, user.password):
        return jsonify({"msg": "datos incorrectos"}), 401 
    
    # if user and user.password != password:
    #     return jsonify ("datos incorrectos"), 401    
    
    access_token = create_access_token(identity=email)
    info_user = {"email":user.email , "name":user.name , "city":user.city , "speed":user.speed , "distance":user.distance, "bikemodel": user.bikemodel , "routetype": user.routetype ,"access_token":access_token}
    # return jsonify(access_token=access_token)   
    return jsonify(info_user)   


#group search
# ojo, falta arreglar que si en la busqueda la palabra buscada está en nombre y en ciudad
# solo incluya un resultado. Arreglar con un if
@api.route('/group_search', methods=['POST'])
def search_groups():
    request_data = request.get_json()
    print(request_data)
    searched = (request_data["busqueda"])
    
    # El primer query lo hice asi pero fallaba y si encontraba el dato en name, ya no continuaba buscando grupos en city
    # asi que he tenido que hacer los querys por separado 
    # grupo1 = Group.query.filter(Group.name.contains(searched)).all() or Group.query.filter(Group.city.contains(searched)).all() or Group.query.filter_by(speed=searched).all() or Group.query.filter_by(distance=searched).all()
    
    if type(searched) is str:
        result1 = Group.query.filter(Group.name.contains(searched)).all()
        result2= Group.query.filter(Group.city.contains(searched)).all()
        group_results = result1 + result2
    else:
        result3 = Group.query.filter_by(speed=searched).all()
        result4 = Group.query.filter_by(distance=searched).all()
        group_results = result3 + result4

    print(group_results)
    NewDict = []

    if not group_results :
        return jsonify("msg: Grupo no encontrado"), 400

    for i in group_results:
        NewDict += [{"name":i.name , "city":i.city , "speed":i.speed , "distance":i.distance , "routetype": i.routetype}]

    return jsonify(NewDict), 200


#user search
@api.route('/user_search', methods=['POST'])
def search_user():
    request_data = request.get_json()
    print(request_data)
    searched = (request_data["busqueda"])
    
    if type(searched) is str:
        result1 = User.query.filter(User.name.contains(searched)).all()
        result2= User.query.filter(User.city.contains(searched)).all()
        result3 = User.query.filter_by(email=searched).all()
        user_results = result1 + result2 + result3
    else:
        result4 = User.query.filter_by(speed=searched).all()
        result5 = User.query.filter_by(distance=searched).all()
        user_results = result4 + result5

    print(user_results)
    UserSearchDict = []

    if not user_results :
        return jsonify("msg: Usuario no encontrado"), 400

    for g in user_results:
        UserSearchDict += [{"name":g.name , "city":g.city , "speed":g.speed , "distance":g.distance , "email":g.email , "bikemodel": g.bikemodel , "routetype": g.routetype}]

    return jsonify(UserSearchDict), 200


#dashboard info grupos
@api.route('/dashboard_info', methods=['GET'])
def dashboard_info():
    
    info_groups = Group.query.all()
    dash_info = []

    for x in info_groups:
        dash_info += [{"name":x.name , "city":x.city , "speed":x.speed , "distance": x.distance , "routetype": x.routetype , "id": x.id}]
   
    return jsonify(dash_info), 200


#info ALL users
@api.route('/all_users', methods=['GET'])
def users_info():
    
    info_users = User.query.all()
    users = []

    for u in info_users:
        users += [{"name":u.name , "city":u.city , "speed":u.speed , "distance": u.distance , "routetype": u.routetype, "bikemodel": u.bikemodel , "email": u.email , "id":u.id }]
   
    return jsonify(users), 200


#dashboard info grupo individual con ruta dinamica
@api.route('/group/<int:groupId>', methods=['GET'])
def group_dinamic(groupId):
    
    current_group = Group.query.get(groupId)
    if not current_group:
        return jsonify("msg: Error. Grupo no encontrado"), 404

    users_quantity = len(current_group.users)
    group_comments = current_group.comments
    group_info = {"name":current_group.name , "city":current_group.city , "speed":current_group.speed , "distance":current_group.distance, "routetype":current_group.routetype ,"users_quantity":users_quantity}
   
    return jsonify(group_info), 200


#editar perfil
## ver seguridad (si va en el front o en el back o donde, como se puede autentificar)
@api.route('/user/edit', methods=['PUT'])

def edit_user():
    body = json.loads(request.data)

    if not body:
        return jsonify("msg: Error. Faltan datos"), 404

    name = request.json.get("name", None)  
    email = request.json.get("email", None)
    # newemail = request.json.get("newemail", None)
    city = request.json.get("city", None)
    bikemodel = request.json.get("bikemodel", None)
    routetype = request.json.get("routetype", None)
    speed = request.json.get("speed", None)
    distance = request.json.get("distance", None)
    
    # if User.query.filter_by(email=newemail).first():
    #     return jsonify("msg: Email ya registrado"), 404

    user = User.query.filter_by(email=email).first()

    if not user :
        return jsonify("msg: Email incorrecto"), 404


    if name:    
        user.name = name
    # if newemail:
    #     user.email = newemail
    if city:
        user.city = city
    if bikemodel:
        user.bikemodel = bikemodel
    if routetype:
        user.routetype = routetype
    if speed:
        user.speed = speed
    if distance:
        user.distance = distance

    db.session.commit()

    return jsonify(user.serialize()), 200


@api.route('/add_group', methods=['POST'])
@jwt_required()
def upload_file():
    #el usuario que se le ingresa la imagen
    userId = get_jwt_identity() #

