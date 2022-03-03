import React, { Component } from 'react'
import {Form, Row, Col, Card, Input, Button, Select, DatePicker, notification, message, Spin, Steps,PageHeader,Transfer} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie'

const domain = process.env.REACT_APP_DOMAIN;
const { Step } = Steps;
const { Option } = Select;

export default class EditUserc extends Component {
    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
        this.Next = this.Next.bind(this);
        this.Previous = this.Previous.bind(this);
        this.obtenerDataUsuario = this.obtenerDataUsuario.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    state = {
        loading_modal: false,
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
        content_popover: (<div></div>),
    }

    async componentDidMount() {
        try{
            await this.fetchData();           
        
        }catch (error){
            //this.setState({ loading: false });
            console.log(error);
        }
    }

    async fetchData(){
        try{
            console.log("fetch data start");
            const u_api = await this.obtenerDataUsuario();
            console.log(u_api);
        

            //this.setState({ loading: false });
        }catch (error){
            console.log(error);
        }
    }

    async obtenerDataUsuario(){
        try{
            //USERDATA
            var id_usuario = this.props.UserId;
            console.log(id_usuario);
            var usr_data_update = await fetch("https://"+domain+"/smartcenter/getuserdata?usuario="+id_usuario);
            var usr_data_array = await usr_data_update.json();
            return usr_data_array;
        }catch (error){
            console.log(error);
        }
    }

    onFinish(values){
           
        /*
        const username = values.Usuario;
        const name = values.Nombre;
        const lastname = values.Apellido;
        const email = values.Email;
        const birthday = values.Birthday._d;


        const empresa = values.Empresa;
        const permiso_empresa = values.Permiso_Empresa;

        const formData_POST = {Usuario:username,Nombre:name,Apellido:lastname,Email:email,Birthday:birthday,Empresa:empresa,Permiso_Empresa:permiso_empresa,Servicios:arr_servicios_seleccionados,Menus:arr_menus_seleccionados};
        
        //setLoading_modal(true);

        try{
            axios.post("https://"+domain+"/smartcenter/insertnewuser", formData_POST)
            .then(function (response){

                var id_usuario_insertado = response.data.v_id_usuario || 0;
                var msg_salida = response.data.v_msg_salida || "";

                //setLoading_modal(false);

                if(id_usuario_insertado === 0){
                    message.error(msg_salida);
                }else{
                    notification['success']({
                        message: msg_salida
                    });
                }
            })
        }catch(error){
            //setLoading_modal(false);
        }
        */
    }

    Next(){
        if(this.state.current_position<3){
            this.setState({ current_position: this.state.current_position+1 });
        }
    }

    Previous(){
        if(this.state.current_position>0){
            this.setState({ current_position: this.state.current_position-1 });
        }
    }

    onChange(nextTargetKeys, direction, moveKeys){
        this.setState({arr_servicios_seleccionados: nextTargetKeys});
    }

    onChange_Menus(nextTargetKeys, direction, moveKeys){
        this.setState({arr_menus_seleccionados:nextTargetKeys});
    }

    render() {
        return (
            <React.Fragment>
            <div>
                <Spin spinning={this.state.loading_modal} delay={100}>
                <React.Fragment>

                <Form layout="vertical" name="control-hooks" onFinish={this.onFinish}>

                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={20}>

                        <Steps size="small" current={this.state.current_position}>
                            <Step title="Usuario" />
                            <Step title="Empresa" />
                            <Step title="Servicio" />
                            <Step title="Menús" />
                        </Steps>

                        <br/>

                        <Card title="Datos de Usuario" style={{ width: "100%" }}>

                            <div style={{display: this.state.display_user,height:"400px"}}>

                                <Form.Item name="Usuario" label="Usuario" rules={[{required: true, message: 'Ingresar Username',},]}>
                                    <Input disabled defaultValue={this.state.user_Username}/>
                                </Form.Item>
                                
                                <Form.Item name="Nombre" label="Nombre" rules={[{required: true, message: 'Ingresar Nombre',},]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="Apellido" label="Apellido" rules={[{required: true, message: 'Ingresar Apellido',},]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="Email" label="Email" rules={[{required: true, message: 'Ingresar Email',},]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item name="Birthday" label="Fecha de Nacimiento" rules={[{required: true, message: 'Seleccionar fecha de nacimiento',},]}> 
                                    <DatePicker placeholder="Fecha nacimiento" style={{width:"100%"}}/>
                                </Form.Item>

                            </div>

                            <div style={{display: this.state.display_empresa,height:"400px"}}>
                                <Form.Item name="Empresa" label="Empresa" hasFeedback rules={[{required: true, message: 'Seleccionar una empresa',},]}>
                                    <Select placeholder="Selecciona una Empresa">
                                        {
                                            this.state.arr_empresa.map(item => (
                                                <Option key={item.ID} value={item.ID}>{item.NOMBRE}</Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item name="Permiso_Empresa" label="Permiso" hasFeedback rules={[{required: true, message: 'Seleccionar permiso',},]}>
                                    <Select placeholder="Seleccionar Permiso">
                                        <Option key="0" value="0">Administrador</Option>
                                        <Option key="1" value="1">Solo lectura</Option>
                                    </Select>
                                </Form.Item>
                            </div>

                            <div style={{display: this.state.display_servicio,height:"400px"}}>
                                <Transfer
                                    dataSource={this.state.arr_servicio}
                                    titles={['Servicios disponibles', 'Servicios seleccionados']}
                                    targetKeys={this.state.arr_servicios_seleccionados}
                                    onChange={() => this.OnChange()}
                                    render={item => item.title}
                                />
                            </div>

                            <div style={{display: this.state.display_menus,height:"400px"}}>
                                <Transfer
                                    dataSource={this.state.arr_menus}
                                    titles={['Menus disponibles', 'Menus seleccionados']}
                                    targetKeys={this.state.arr_menus_seleccionados}
                                    onChange={() => this.OnChangeMenu()}
                                    render={item => item.title}
                                />
                            </div>

                        </Card>
                    </Col>
                    <Col span={2}></Col>
                </Row>
                <Row gutter={[16, 16]}>
                </Row>

                <Row>
                    <Col span={2}></Col>

                    <Col span={2}>
                        <div style={{display: this.state.setDisplay_anterior}}>
                            <Button onClick={() => this.Previous()} type="dashed" shape="circle" icon={<LeftOutlined />} />
                        </div>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}></Col>
                    <Col span={2}>
                        <div style={{display: this.state.display_submit}}>
                            <Form.Item>
                                <Button disabled={this.state.submit_status} type="default" htmlType="submit">
                                    Actualizar
                                </Button>
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={2}>
                        <div style={{display: this.state.display_siguiente}}>
                            <Button onClick={() => this.Next()} type="dashed" shape="circle" icon={<RightOutlined />} />
                        </div>
                    </Col>

                    <Col span={2}></Col>
                </Row>

                </Form>

                </React.Fragment>
                </Spin>
            </div>
        </React.Fragment>
        )
    }
}
