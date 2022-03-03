import React, { Component } from 'react'
import {Table, Row, Col, Typography, Button, Modal, Spin, Badge, Collapse, List, message, Popover, Tooltip, notification, Transfer, Form, Steps,Input, Card,Select,DatePicker} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import NewUser from './NewUser'
import EditUser from './EditUser'
import EditUserc from './EditUserc'
import moment from 'moment';
import Cookies from 'js-cookie'

const { Title } = Typography;
const { Panel } = Collapse;
const { Step } = Steps;
const { Option } = Select;

const domain = process.env.REACT_APP_DOMAIN;

export default class Usuarios extends Component {
    constructor(props) {
        super(props);
        this.cargarUsuarios = this.cargarUsuarios.bind(this);
        this.PermisosUsuario = this.PermisosUsuario.bind(this);
    }

    async obtenerArrayUsuarios(){
        try {
            this.setState({ loading: true });
    
            const data = await fetch("https://"+domain+"/smartcenter/getallusers");
            const array_usuarios = await data.json();
    
            this.setState({ usuarios_api: array_usuarios });
    
            return array_usuarios;
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async PermisosUsuario(registro){

        if(this.state.mostrar_crud){
            var id_usr = registro.key;
            this.setState({ id_usuario: id_usr });
            this.setState({ ModalActualizarUsuario_visible: true });
        }else{
            message.error("Usuario no cuenta con permisos necesarios.");
        }
    }

    async cargarUsuarios(){
        try {
            var arr = [];
            
            const u_api = await this.obtenerArrayUsuarios();
    
            for (var i in u_api){
    
                var vfecha_nacimiento = u_api[i].FECHA_NACIMIENTO;
                vfecha_nacimiento = vfecha_nacimiento.split(".")[0];
                vfecha_nacimiento = vfecha_nacimiento.replace("T"," ");

                var id = u_api[i].ID;
                var user = u_api[i].USUARIO;
                var name = u_api[i].NOMBRE;
                var lastname = u_api[i].APELLIDO;
                var correo = u_api[i].EMAIL;

                const fila = {key: id, usuario: user, nombre: name, apellido: lastname, email: correo, nacimiento: vfecha_nacimiento}
                arr.push(fila);
            }
    
            this.setState({ usuarios_tabla: arr });
            this.setState({ loading: false });
        } catch (err) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    async obtenerArrayPermisos(){
        try {
            const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM')) || "";
            const data = await fetch("https://"+domain+"/smartcenter/getuseradmenterprises?usuario="+Usuario_SM.user_id);
            const array_permisos = await data.json();
            
            return array_permisos;
        } catch (error) {
            return [];
        }
    }

    async ObtenerPermisosAdmin(){
        const p_api = await this.obtenerArrayPermisos();
        
        if(p_api.length > 0){
            this.setState({ permiso_usuario: p_api});
            this.setState({mostrar_crud:true});
        }
    }

    async componentDidMount() {
        try {
            await this.cargarUsuarios();
            await this.ObtenerPermisosAdmin();
        } catch (error) {
            message.error("Ocurrió un error. Favor intentar más tarde.");
        }
    }

    ModalNuevoUsuario(){
        if(this.state.mostrar_crud){
                this.setState({ ModalNuevoUsuario_visible: true });
            window.scrollTo({
                top: document.body.scrollHeight,
                left: 0,
                behavior: 'smooth'
            });
        }else{
            message.error("Usuario no cuenta con permisos necesarios.");
        }
    }

    state = {
        loading: false,
        loading_campaign_details: false,
        isModalVisible: false,
        ModalNuevoUsuario_visible: false,
        ModalActualizarUsuario_visible: false,
        usuarios_tabla: [],
        usuarios_api: [],
        id_usuario: 0,
        status_campaign: "",
        columnas_exportar: [],
        loading_modal_update_user: false,

        display_user: "block",
        display_empresa: "none",
        display_servicio: "none",
        display_menus: "none",
        display_submit: "none",
        display_siguiente: "block",
        display_anterior: "block",
        submit_status: true,
        current_position: 0,
        arr_empresa: [],
        arr_servicio: [],
        arr_servicios_seleccionados: [],
        arr_menus: [],
        arr_menus_seleccionados: [],
        user_Username: "",
        user_Nombre: "",
        user_Apellido: "",
        user_Email: "",
        user_Nacimiento: "",
        empresa_seleccionada: 0,
        
        permiso_usuario: null,
        mostrar_crud:false,

        content_popover: (<div></div>),
        columns: [
            {
              title: 'Usuario',
              dataIndex: 'usuario',
              key: 'usuario',
            },
            {
              title: 'Nombre',
              dataIndex: 'nombre',
              key: 'nombre',
            },
            {
              title: 'Apellido',
              dataIndex: 'apellido',
              key: 'apellido',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '',
                key: 'key',
                dataIndex: 'key',
                render: (text, record) => (
                    <Button onClick={async () => await this.PermisosUsuario(record)} type="primary">Permisos</Button>
                ),
            },
        ],
    }

    render() {
        return (
            <div style={{marginLeft: "250px"}}>
                <br/>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}><Title>Usuarios</Title></Col>
                    <Col span={2}></Col>
                </Row>
                <br/>
                <Row>
                    <Col span={2}></Col>
                    <Col span={20}>
                        {this.state.permiso_usuario ? (
                                <p style={{textAlign:"right"}}><Button onClick={() => this.ModalNuevoUsuario()}>+</Button></p>
                            ) : (
                                <div></div>
                            )
                        }
                        <Table dataSource={this.state.usuarios_tabla} columns={this.state.columns} pagination={{ defaultPageSize: 10}} loading={this.state.loading} />
                    </Col>
                    <Col span={2}></Col>
                </Row>

                <Modal width={600} title="Nuevo Usuario" visible={this.state.ModalNuevoUsuario_visible} onCancel={() => this.setState({ ModalNuevoUsuario_visible: false })} footer={<Button key="back" onClick={() => this.setState({ ModalNuevoUsuario_visible: false })}>Cancelar</Button>}>
                    <NewUser/>
                    <div ref={el => { this.el = el; }} />
                </Modal>

                <Modal width={600} title="Actualizar Usuario" visible={this.state.ModalActualizarUsuario_visible} onCancel={() => this.setState({ ModalActualizarUsuario_visible: false })} footer={<Button key="back" onClick={() => this.setState({ ModalActualizarUsuario_visible: false })}>Cancelar</Button>}>
                <Spin spinning={this.state.loading_modal_update_user} delay={100}>
                    <EditUser UserId={this.state.id_usuario}/>
                    <div ref={el => { this.el = el; }} />
                </Spin>
                </Modal>
            </div>
        )
    }
}
