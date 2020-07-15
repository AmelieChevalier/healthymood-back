import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import API from '../services/API';
import '../Styles/EditorForm.css';
import '../Styles/Form.css';
import TagSelect from '../components/TagSelect';
import queryString from 'query-string';

const EditRecipes = () => {
  const { id } = useParams();
  const history = useHistory();
  const editMode = id !== 'new';
  const [allIngredients, setAllIngredients] = useState([]);
  const [chosenIngredients, setChosenIngredients] = useState([]);

  const date = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState({
    name: '',
    slug: '',
    content: '',
    budget: null,
    published: false,
    created_at: date,
    image: ''
  });
  /*--------------------------*/
  const getResourceCollection = async (url) => {
    let data = [];
    try {
      const result = await API.get(url);
      data = await result.data.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  };
  /*--------------------------*/
  const uploadImage = (e) => {
    e.preventDefault();
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('picture', image);
    API.post('/recipes/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => res.data)
      .then(tab => {
        setData({ ...data, image: tab });
      })
  }
  /*--------------------------*/
  useEffect(() => {
    if (editMode) {
      API.get(`/recipes/${id}`)
        .then(res => {
          setData(res.data.data);
          setChosenIngredients(res.data.data.ingredients.map(tagToOption))
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []); // eslint-disable-line
  /*--------------------------*/
  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setData({ ...data, [name]: value });
  };
  /*--------------------------*/
  const handleChangeEditor = (content) => {
    setData({ ...data, content });
  };
  /*--------------------------*/
  const handleSubmit = (event) => {
    event.preventDefault();
    if (editMode) {
      API.patch(`/recipes/${id}`, ({ ...data, ingredients: chosenIngredients }))
        .then(res => {
          history.push('/recipes');
          console.log(data)
        })
        .catch((err) => {
          console.warn(err);
        });
    } else {
      API.post('/recipes', ({ ...data, ingredients: chosenIngredients }))
        .then((res) => {
          history.push('/recipes');
          console.log(data)
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };
  /*--------------------------*/
  const populateInputs = (allIngredients) => {
    const query = queryString.parse({ arrayFormat: 'bracket' });
    const { ingredients } = query; // eslint-disable-line
    if (ingredients) {
      setChosenIngredients(allIngredients.filter(ingredient => ingredients.includes(ingredient.value.toString())));
    }
  };
  /*--------------------------*/
  useEffect(() => {
    Promise.all([getAllIngredients()])
      .then(([allIngredients]) => {
        populateInputs(allIngredients);
      });
  }, []) // eslint-disable-line
  const tagToOption = tag => ({ value: tag.id, label: tag.name });
  const getAllIngredients = () => {
    return getResourceCollection('ingredients').then(tags => {
      const options = tags.map(tagToOption);
      setAllIngredients(options);
      return options;
    });
  };



  return (
    <>
      <main className='main-form-container'>
        <form className='editor-form' onSubmit={(e) => handleSubmit(e)}>
          <div className='div-top-editor'>
            <input
              type='text'
              name='name'
              minLength='3'
              maxLength='20'
              value={data.name}
              placeholder='Ajouter un titre'
              onChange={(e) => handleChange(e)}
              required
            />

            <label className='hide-label' htmlFor='slug'>slug</label>
            <input
              type='text'
              name='slug'
              minLength='3'
              maxLength='20'
              value={data.slug}
              placeholder='Ajouter un slug'
              onChange={(e) => handleChange(e)}
              required
            />

            <input
              type='number'
              name='budget'
              minLength='1'
              maxLength='20'
              value={data.budget}
              placeholder='Budget €'
              onChange={(e) => handleChange(e)}
              required
            />
            <br></br>

            <input
              name='picture'
              accept="image/*"
              id="picture"
              type="file"
              onChange={e => uploadImage(e)}
            />
          </div>

          <Editor
            apiKey={process.env.REACT_APP_API_KEY}
            value={data.content}
            initialValue=''
            init={{
              height: 500,
              autosave_interval: '5s',
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount',
                'autosave'
              ],
              autosave_retention: '30m',
              autosave_restore_when_empty: true,
              toolbar:
                'undo redo | formatselect | bold italic backcolor blockquote | alignleft aligncenter alignright alignjustify | link image media | bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={handleChangeEditor}
          />
          <div className='div-bottom-editor'>
            <label htmlFor='published'>Publier </label>
            <input
              style={{ width: '30px' }}
              type='checkbox'
              name='published'
              checked={data.published}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button type='submit' className='btn'>{editMode ? 'Modifier' : 'Ajouter'}</button>

          <div className='tag-select' style={{ width: '20%' }}>
            <TagSelect
              options={allIngredients}
              name='tag-select'
              value={chosenIngredients}
              onChange={(newValues) => {
                setChosenIngredients(newValues);
              }}
              placeholder='Ingrédients'
            />
          </div>
        </form>
      </main>
    </>
  );
};

export default EditRecipes;
