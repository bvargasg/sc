import React from 'react'
import { useState, useEffect } from 'react';
import {Form, Row, Col, Card, Input, Button, Select, DatePicker, notification, message, Spin, Steps,PageHeader,Transfer,Typography} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie'
import moment from 'moment';

const domain = process.env.REACT_APP_DOMAIN;
const { Step } = Steps;
const { Option } = Select;
const { Title } = Typography;

function EditUser(props) {

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

    //USERDATA
    const [user_Username,set_user_Username] = useState("");
    const [user_Nombre,set_user_Nombre] = useState("");
    const [user_Apellido,set_user_Apellido] = useState("");
    const [user_Email,set_user_Email] = useState("");
    const [user_Nacimiento,set_user_Nacimiento] = useState("2021/01/01");

    const [user,setUser] = useState(null);
    const [total_empresas,setTotalEmpresas] = useState(null);
    const [empresas_asociadas,setEmpresasAsociadas] = useState(null);

    
    const onFinish = (values) => {

        //console.log(values);
        
        const id_usuario = props.UserId;
        const username = user_Username;
        const name = user_Nombre;
        const lastname = user_Apellido;
        const email = user_Email;
        const birthday = user_Nacimiento;


        const empresa = values.Empresa;
        const permiso_empresa = values.Permiso_Empresa;

        const formData_POST = {Id_Usuario:id_usuario,Usuario:username,Nombre:name,Apellido:lastname,Email:email,Birthday:birthday,Empresa:empresa,Permiso_Empresa:permiso_empresa,Servicios:arr_servicios_seleccionados,Menus:arr_menus_seleccionados};
        
        //setLoading_modal(true);

        try{
            axios.post("https://"+domain+"/smartcenter/updateuser", formData_POST)
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

    function onChangeNombre(e){
        //console.log(e.target.value);
        set_user_Nombre(e.target.value);
    }
    function onChangeApellido(e){
        //console.log(e.target.value);
        set_user_Apellido(e.target.value);
    }
    function onChangeEmail(e){
        //console.log(e.target.value);
        set_user_Email(e.target.value);
    }
    function onChangeBirthday(e){
        //console.log(e._d);
        try {
            var d = new Date(e._d).toISOString().split('T')[0];
            set_user_Nacimiento(d);
        } catch (error) {
            
        }
    }

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

    useEffect(() => {
        (async () => {
            //USERDATA
            setLoading_modal(true);
            var id_usuario = props.UserId;
            var usr_data_update = await fetch("https://"+domain+"/smartcenter/getuserdata?usuario="+id_usuario);
            var usr_data_array = await usr_data_update.json();
            setUser(usr_data_array);
            
            //EMPRESAS
            const listado_empresas = await fetch("https://"+domain+"/smartcenter/getenteprisesperuser?usuario="+id_usuario);
            const list_empresas = await listado_empresas.json();
            const total_empresas = list_empresas.total_empresas;
            const empresas_asociadas = list_empresas.empresas_asociadas;

            setTotalEmpresas(total_empresas);
            setArray_empresa(total_empresas);
            setEmpresasAsociadas(empresas_asociadas);

            //SERVICIOS
            const listado_servicios = await fetch("https://"+domain+"/smartcenter/getserviceperuser?usuario=0");
            const list_servicios = await listado_servicios.json();
            const total_servicios = list_servicios;
            
            const listado_servicios_asociados = await fetch("https://"+domain+"/smartcenter/getserviceperuser?usuario="+id_usuario);
            const list_servicios_asociados = await listado_servicios_asociados.json();
            const total_servicios_asociados = list_servicios_asociados;

            /*
            for (var s in total_servicios){
                for (var sa in total_servicios_asociados){
                    if(total_servicios[s].ID === total_servicios_asociados[sa].ID){
                        total_servicios.splice(s, 1);
                    }
                }
            }
            */

            //FORMATO TRANSFER
            var arr_formato_transfer = [];

            for (var i in total_servicios){
                arr_formato_transfer.push({
                    key:total_servicios[i].ID,
                    title:total_servicios[i].NOMBRE,
                    description: "",
                });
            }

            var arr_formato_transfer_asociado = [];

            for (var z in total_servicios_asociados){
                arr_formato_transfer_asociado.push({
                    key:total_servicios_asociados[z].ID,
                    title:total_servicios_asociados[z].NOMBRE,
                    description: "",
                });
            }

            setArray_servicio(arr_formato_transfer);
            //setArray_servicios_seleccionados(arr_formato_transfer_asociado);


            //MENUS
            const data_menus = await fetch("https://"+domain+"/smartcenter/getmenusperuser?usuario="+id_usuario);
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

        })();
    }, [props.UserId]);

    useEffect(() => {
        (async () => {
            if(user !== null){
                console.log(user);

                set_user_Username(user.USUARIO);
                set_user_Nombre(user.NOMBRE);
                set_user_Apellido(user.APELLIDO);
                set_user_Email(user.EMAIL);
                set_user_Nacimiento(user.FECHA_NACIMIENTO);

                setLoading_modal(false);
            }
        })();
    }, [props.UserId,user]);

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

                                <Title level={5}>Usuario</Title>
                                <p style={{display:"none"}}>{user_Username}</p>
                                <Input disabled value={user_Username}/>
                                
                                <Title level={5}>Nombre</Title>
                                <p style={{display:"none"}}>{user_Nombre}</p>
                                <Input value={user_Nombre} onChange={onChangeNombre} />

                                <Title level={5}>Apellido</Title>
                                <p style={{display:"none"}}>{user_Apellido}</p>
                                <Input value={user_Apellido} onChange={onChangeApellido} />

                                <Title level={5}>Email</Title>
                                <p style={{display:"none"}}>{user_Email}</p>
                                <Input value={user_Email} onChange={onChangeEmail} />

                                <Title level={5}>Fecha Nacimiento</Title>
                                <p style={{display:"none"}}>{user_Nacimiento}</p>
                                <DatePicker placeholder="Fecha nacimiento" style={{width:"100%"}} defaultValue={moment(user_Nacimiento,"YYYY/MM/DD")} onChange={onChangeBirthday} />

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
                                    Actualizar
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

export default EditUser
