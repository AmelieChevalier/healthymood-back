import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../Styles/EditorForm.css';
import '../Styles/Form.css';
import API from '../services/API';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const Articles = () => {
  const history = useHistory();
  const [articles, setArticles] = useState([]);
  const URL = process.env.REACT_APP_API_BASE_URL;

  const handleDelete = (id) => {
    if (window.confirm('Êtes vous sûr de vouloir supprimer cette Article ?')) {
      API.delete(`/articles/${id}`)
        .then(res => {
          const currentArticle = articles.filter(p => p.id !== id);
          setArticles(currentArticle);
        })
        .catch(err => {
          console.warn(err);
        });
    }
  };

  useEffect(() => {
    API.get('/articles')
      .then(res => {
        setArticles(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []); // eslint-disable-line

  return (
    <>
      <div style={{ paddingTop: '20px' }}>
        <Link to='/articles/edit/new'>
          <button className='form-button'>Ajouter</button>
        </Link>
      </div>

      <br />
      <table className='render-list'>
        <thead>
          <tr>
            <td>Titre</td>
            <td>Slug</td>
            <td>Image Principale</td>
            <td>Date</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {articles.map(a => {
            return (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.slug}</td>
                <td><img src={URL + '/' + a.image} alt='article' className='img-uploaded' /></td>
                <td>Crée le : {moment(a.created_at).format('DD/MM/YYYY')}</td>
                <td>
                  <EditOutlined className='edit-icon' onClick={() => history.push(`/articles/edit/${a.id}`)} />
                  <DeleteOutlined className='delete-icon' onClick={() => handleDelete(a.id)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </>
  );
};
export default Articles;
