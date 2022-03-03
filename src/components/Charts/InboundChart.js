import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from '@ant-design/charts';
import { Card } from 'antd';
import Cookies from 'js-cookie'
const domain = process.env.REACT_APP_DOMAIN;

function InboundChart(props){
    const [data, setData] = useState([]);
    useEffect(() => {
        var p = {props};
        p = p.props.palabras;
        setData(p);
        console.log(p);
    }, [props]);

    var config = {
        appendPadding: 10,
        data: data,
        angleField: 'value',
        colorField: 'name',
        radius: 1,
        legend: false,
        label: {
          type: 'outer',
          content: '{name} {percentage}',
        },
        interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
      };

  return (
    <React.Fragment>
      <Card title="Wordcloud" style={{ width: "90%", height: "500px", maxHeight: "500px" }}>
      <Pie style={{"height":"350px"}} {...config} />
      </Card>
    </React.Fragment>
  );
}

export default InboundChart;