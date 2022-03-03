import React from 'react'
import { useState, useEffect } from 'react';
import {Form, Row, Col, Card, Input, Button, Select, DatePicker, notification, message, Spin, Steps,PageHeader,Transfer} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie'

const domain = process.env.REACT_APP_DOMAIN;
const { Step } = Steps;
const { Option } = Select;

function NewUser() {

    const [form] = Form.useForm();

    //const {user} = useContext(UserContext);
    const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM'));
    const [loading_modal, setLoading_modal] = useState(false);
    const [display_user, setDisplay_user] = useState("block");
    const [display_empresa, setDisplay_empresa] = useState("none");
    const [display_servicio, setDisplay_servicio] = useState("none");
    const [display_menus, setDisplay_menus] = useState("none");
    const [display_submit, setDisplay_submit] = useState("none");
    const [display_siguiente, setDisplay_siguiente] = useState("block");
    const [display_anterior, setDisplay_anterior] = useState("block");
    const [submit_status, setSubmit_status] = useState(true);

    const [current_position, setCurrent_position] = useState(0);

    const [arr_empresa, setArray_empresa] = useState([]);
    const [arr_servicio, setArray_servicio] = useState([]);
    const [arr_servicios_seleccionados, setArray_servicios_seleccionados] = useState([]);

    const [arr_menus, setArray_menus] = useState([]);
    const [arr_menus_seleccionados, setArray_menus_seleccionados] = useState([]);

    
    const onFinish = (values) => {
           
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

    };

    useEffect(() => {
        (async () => {
            //EMPRESAS
            const usr_id = Usuario_SM.user_id
            const data = await fetch("https://"+domain+"/smartcenter/getenteprisesperuser?usuario=0");
            var array_empresas = await data.json();
            array_empresas = array_empresas.total_empresas;

            setArray_empresa(array_empresas);

            //SERVICIOS
            const data_serv = await fetch("https://"+domain+"/smartcenter/getserviceperuser?usuario=0");
            const array_serv = await data_serv.json();

            var arr_formato_transfer = [];

            for (var i in array_serv){
                arr_formato_transfer.push({
                    key:array_serv[i].ID,
                    title:array_serv[i].NOMBRE,
                    description: "",
                });
            }
            setArray_servicio(arr_formato_transfer);

            //MENUS
            const data_menus = await fetch("https://"+domain+"/smartcenter/getmenusperuser?usuario=0");
            var array_menus = await data_menus.json();
            array_menus = array_menus.total_menus;

            var arr_formato_transfer_menus = [];

            for (var i in array_menus){
                arr_formato_transfer_menus.push({
                    key:array_menus[i].ID,
                    title:array_menus[i].NOMBRE,
                    description: "",
                });
            }
            setArray_menus(arr_formato_transfer_menus);
            
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(current_position === 0){
            //USUARIOS
            setDisplay_user("block");
            setDisplay_empresa("none");
            setDisplay_servicio("none");
            setDisplay_menus("none");

            setDisplay_siguiente("block");
            setDisplay_submit("none");
        }else if (current_position === 1){
            //EMPRESA
            setDisplay_user("none");
            setDisplay_empresa("block");
            setDisplay_servicio("none");
            setDisplay_menus("none");

            setDisplay_siguiente("block");
            setDisplay_submit("none");
        }else if (current_position === 2){
            //SERVICIOS
            setDisplay_user("none");
            setDisplay_empresa("none");
            setDisplay_servicio("block");
            setDisplay_menus("none");

            setDisplay_siguiente("block");
            setDisplay_submit("none");

        }else if (current_position === 3){
            //SERVICIOS
            setDisplay_user("none");
            setDisplay_empresa("none");
            setDisplay_servicio("none");
            setDisplay_menus("block");

            setDisplay_siguiente("none");
            setDisplay_submit("block");

        }
        
    }, [current_position]);

    function Next(){
        if(current_position<3){
            setCurrent_position(current_position+1);
        }
    }

    function Previous(){
        if(current_position>0){
            setCurrent_position(current_position-1);
        }
    }

    const onChange = (nextTargetKeys, direction, moveKeys) => {
        setArray_servicios_seleccionados(nextTargetKeys);
    };

    const onChange_Menus = (nextTargetKeys, direction, moveKeys) => {
        setArray_menus_seleccionados(nextTargetKeys);
    };

    useEffect(() => {
        if(arr_servicios_seleccionados.length>0 && arr_menus_seleccionados.length>0){
            setSubmit_status(false);
        }else{
            setSubmit_status(true);
        }
    }, [arr_servicios_seleccionados,arr_menus_seleccionados]);


    return (
        <React.Fragment>
            <div>
                <Spin spinning={loading_modal} delay={100}>
                <React.Fragment>

                <Form layout="vertical" form={form} name="control-hooks" onFinish={onFinish}>

                <Row gutter={[16, 16]}>
                    <Col span={2}></Col>
                    <Col span={20}>

                        <Steps size="small" current={current_position}>
                            <Step title="Usuario" />
                            <Step title="Empresa" />
                            <Step title="Servicio" />
                            <Step title="Menús" />
                        </Steps>

                        <br/>

                        <Card title="Datos de Usuario" style={{ width: "100%" }}>

                            <div style={{display: display_user,height:"400px"}}>

                                <Form.Item name="Usuario" label="Usuario" rules={[{required: true, message: 'Ingresar Username',},]}>
                                    <Input />
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

                            <div style={{display: display_empresa,height:"400px"}}>
                                <Form.Item name="Empresa" label="Empresa" hasFeedback rules={[{required: true, message: 'Seleccionar una empresa',},]}>
                                    <Select placeholder="Selecciona una Empresa">
                                        {
                                            arr_empresa.map(item => (
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

                            <div style={{display: display_servicio,height:"400px"}}>
                                <Transfer
                                    dataSource={arr_servicio}
                                    titles={['Servicios disponibles', 'Servicios seleccionados']}
                                    targetKeys={arr_servicios_seleccionados}
                                    onChange={onChange}
                                    render={item => item.title}
                                />
                            </div>

                            <div style={{display: display_menus,height:"400px"}}>
                                <Transfer
                                    dataSource={arr_menus}
                                    titles={['Menus disponibles', 'Menus seleccionados']}
                                    targetKeys={arr_menus_seleccionados}
                                    onChange={onChange_Menus}
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
                        <div style={{display: setDisplay_anterior}}>
                            <Button onClick={Previous} type="dashed" shape="circle" icon={<LeftOutlined />} />
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
                        <div style={{display: display_submit}}>
                            <Form.Item>
                                <Button disabled={submit_status} type="default" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </div>
                    </Col>
                    <Col span={2}>
                        <div style={{display: display_siguiente}}>
                            <Button onClick={Next} type="dashed" shape="circle" icon={<RightOutlined />} />
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

export default NewUser
