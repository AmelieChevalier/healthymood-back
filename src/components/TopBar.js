import React, { useContext } from 'react';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import avatar from '../images/Luffy-One-Piece.png';
import '../Styles/TopBar.css';
import AuthContext from '../context/authContext';

const { Header } = Layout;

const TopBar = () => {
  const setTokenInLocalStorage = useContext(AuthContext).setToken;
  const menu = (
    <Menu>
      <Menu.Item key='0' icon={<UserOutlined />}>
        <Link exact to='/mon-profil' className='dropdown-link'>
          Mon Profil
        </Link>
      </Menu.Item>
      <Menu.Item key='1' icon={<LogoutOutlined />}>
        <Link exact to='/login' onClick={() => setTokenInLocalStorage('')} className='dropdown-link'>
          Déconnexion
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Header className='site-layout-background header' style={{ padding: 0 }}>
        <Dropdown overlay={menu} trigger={['click']} placement='bottomLeft'>
          <span
            className='ant-dropdown-toggler'
            onClick={(e) => e.preventDefault()}
          >
            <Avatar src={avatar} />
          </span>
        </Dropdown>
        ,
      </Header>
    </>
  );
};

export default TopBar;
