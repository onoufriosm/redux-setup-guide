/* Dependencies */
import React from 'react';

import 'antd/dist/antd.css';

import { Layout } from 'antd';

import Main from '../Main';

const {
  Header, Content,
} = Layout;

const AppLayout = () => (
  <Layout>
    <Header style={{ textAlign: 'center', color: 'white', fontWeight: 600 }}>
      State management with Redux demo
    </Header>
    <Content style={{ padding: 20, minHeight: '100vh' }}>
      <Main />
    </Content>
  </Layout>
);

export default AppLayout;
