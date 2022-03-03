import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import Cookies from 'js-cookie'
import { Row, Col } from 'antd';
import { Form, Input, Button, Typography, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
const domain = process.env.REACT_APP_DOMAIN;

function Login() {
    const { setUser} = useContext(UserContext);
    const [loading_modal, setLoading_modal] = useState(false);

    const { Title } = Typography;

    /*
    const onFinish = values => {
        const username = values.username;
        const pass = values.password;
        const id_usuario = 1;

        const usrObj = {user_id:id_usuario,usuario: username, password: pass}
        setUser(usrObj);
    };
    */
    const onFinish = async (values) => {
        const username = values.username;
        const pass = values.password;

        setLoading_modal(true);
        await axios.post("https://"+domain+"/smartcenter/loginpetition", {usuario: username, password: pass})
        .then(function (response){
                
            var usr_data = response.data;
            var match = usr_data.match;

            setLoading_modal(false);
            if(match){
                const usrObj = {user_id:usr_data.ID,usuario: usr_data.USUARIO, password: usr_data.PSSWORD}
                //setUser(usrObj);
                Cookies.set('Usuario_SM', JSON.stringify(usrObj));
                window.location.href = '/';
            }else{
                message.error("noup");
            }

        });
    }

    return (
        <div style={{marginTop:"100px"}}>
        <Spin spinning={loading_modal} delay={100}>
        <Row>
            <Col span={10}></Col>
            <Col span={4}>
                <p style={{textAlign:"center"}}><Title>Login</Title></p>
                <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                size="large"
                >
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Por favor, ingrese su usuario',
                    },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Usuario" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Por favor, ingrese su contraseña',
                    },
                    ]}
                >
                    <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Contraseña"
                    />
                </Form.Item>
                {/*
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                    Forgot password
                    </a>
                </Form.Item>
                 */}
                <Form.Item>
                    <Button style={{width:"100%"}} type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
                </Form>
            </Col>
            <Col span={10}></Col>
        </Row>
        </Spin>
        </div>
    )
}

export default Login;
