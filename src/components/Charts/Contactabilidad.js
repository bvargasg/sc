import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from '@ant-design/charts';
import { Card } from 'antd';
import Cookies from 'js-cookie'
const domain = process.env.REACT_APP_DOMAIN;

function Contactabilidad(props){
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData(){
        const result = await axios("https://"+domain+"/smartcenter/contact",);
        const respuesta = result.data[0];
        console.log(respuesta);
        setData([{"tipo": "Contactados", "cantidad": respuesta.v_comprometidos},{"tipo": "Sin discar", "cantidad": respuesta.v_no_discados},{"tipo": "Sin contactabilidad", "cantidad": respuesta.v_discados_sin_contactabilidad}]);
    }
    fetchData();
  },[]);

  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'cantidad',
    colorField: 'tipo',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  return (
    <React.Fragment>
      <br/>
      <Card title="Contactabilidad de interacciones">
      <Pie {...config} />
      </Card>
    </React.Fragment>
  );
}

export default Contactabilidad;