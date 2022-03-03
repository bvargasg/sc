import React, { Component } from 'react'
import Cookies from 'js-cookie'
import './Navbar.css';
import { Layout, Menu, Col, Row, Button, Divider } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom'

const { Sider } = Layout;
const { SubMenu } = Menu;

const domain = process.env.REACT_APP_DOMAIN;

export default class Navbar extends Component {

    state = {
      listado_menu: []
    }

    async componentDidMount() {
      const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM')); //user_id
      const usuario = Usuario_SM.user_id;
      const data = await fetch("https://"+domain+"/smartcenter/listadomenu?usuario="+usuario);
      const menu_array = await data.json();
      this.setState({ listado_menu: menu_array });
    }

    render() {
        return (
            <div>
              <Layout>
              <Sider
                style={{
                  overflow: 'auto',
                  height: '100vh',
                  position: 'fixed',
                  left: 0,
                }}
              >
                <div className="logo gutter-row">
                  <Row>
                    <Col span={12}>
                      <a href="/"><img style={{width: "50px", marginTop: "20px", marginLeft: "20px"}} src="https://www.entel.cl/repositorio/assets/img/Icon/logo-entel/PNG/white@2x.png?v=50" alt="logo"/></a>
                    </Col>
                    <Col span={12}>
                      <Button style={{marginTop: "26px", marginLeft: "50px"}} type="text"><MenuOutlined style={{color:"white", fontSize :"1.5em"}}/></Button>
                    </Col>
                  </Row>
                </div>
                <br/>

                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>

                  {
                    this.state.listado_menu.map( m => {
                      if (m.NOMBRE === "GESTOR DE CAMPAÑAS"){
                        return (
                               <React.Fragment>
                                 <Divider style={{ borderColor: '#4263FB' }} />
                                  <Menu.Item key={m.NOMBRE}>
                                    <Link to="CAMPAÑAS">
                                      {m.NOMBRE}
                                    </Link>
                                  </Menu.Item>
                               </React.Fragment>
                                )                     
                      }
                      else if (m.NOMBRE === "CONFIG. DE CAMPAÑA"){
                        return (
                                <Menu.Item key={m.NOMBRE}>
                                  <Link to="CONFIGCAMPAÑA">
                                    {m.NOMBRE}
                                  </Link>
                                </Menu.Item>
                              )
                      }
                      else if (m.NOMBRE === "GESTOR DE USUARIOS"){
                        return (
                                <Menu.Item key={m.NOMBRE}>
                                  <Link to="USUARIOS">
                                    {m.NOMBRE}
                                  </Link>
                                </Menu.Item>
                              )
                      }
                      else{
                        return (<Menu.Item key={m.NOMBRE}>
                                  <Link to={m.NOMBRE}>
                                    {m.NOMBRE}
                                  </Link>
                                </Menu.Item>)
                      }
                    })
                  }

                </Menu>
                </Sider>
              </Layout>
            </div>
        )
    }
}
