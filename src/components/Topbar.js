import React from 'react'
import Cookies from 'js-cookie'
import { Avatar} from 'antd';
import { Menu, Dropdown, Row, Col } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

//import { UserContext } from '../UserContext'

function Topbar() {

    const menu = (
        <Menu style={{width:"200px"}}>
          <Menu.Item style={{height:"100%"}}>
            <SettingOutlined/> Configuración
          </Menu.Item>
          <hr style={{border:"0",borderTop:"1px solid #F2F2F2"}} />
          <Menu.Item>
            <span onClick={() => {Logout()}}> <LogoutOutlined/> Cerrar sesión</span>
          </Menu.Item>
        </Menu>
      );

    //const {user, setUser} = useContext(UserContext);
    const Usuario_SM = JSON.parse(Cookies.get('Usuario_SM'));
      
    function Logout(){
        //setUser(null);
        Cookies.remove('Usuario_SM');
        window.location.href = '/LOGIN';
    }

    return (
        <div style={{float:"right", marginTop:"10px", marginRight:"10px"}}>
                <Row>
                    <Col style={{marginTop:"5px", marginRight:"5px"}}>{Usuario_SM.usuario}</Col>
                    <Col>
                        <Dropdown overlay={menu} placement="bottomLeft" arrow>
                            <Avatar icon={<UserOutlined />} />
                        </Dropdown>
                    </Col>
                </Row>
        </div>
    )
}

export default Topbar;
