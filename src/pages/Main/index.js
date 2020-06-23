/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import {View, Text} from 'react-native';
import { Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Repository from '../../components/repository/index';
import {Container, Title, Form, Input, Submit, List} from './styles';
import api from '../../services/api';
import getRealm from '../../services/realm';

export default function Main() {
  const [ input, setInput ] = useState('');
  const [ error, setError ] = useState(false);
  const [ repositories, setRepositories ] = useState([]);

  useEffect(() =>{
    async function loadRepositories(){
      const realm = await getRealm();
      const data = realm.objects('Repository').sorted('stars', true);
      setRepositories(data);
    }
    loadRepositories();
  }, []);

  async function saveRepository( repository){
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

    const realm = await getRealm();
    //Tudo que fizer aqui vai de salvo no BD
    realm.write(()=>{
      realm.create('Repository', data, 'modified');

    });
    return data;
  }

  async function handleAddRepository(){
   try {
     const response = await api.get(`/repos/${input}`);
     await saveRepository(response.data);

     setInput(response.data);
     setError(false);
     console.log(input);
     Keyboard.dismiss();
   }
   catch (err){
    setError(true);
    console.log(input);
    console.log(err);
   }
  }

  async function handleRefreshRepository(repository){
    const response = await api.get(`/repos/${repository.fullName}`);
    const data = await saveRepository( response.data);
    setRepositories(repositories.map(rep => (rep.id == data.id ? data : rep )));
  }

  return (
    <Container>
      <Title>Repositórios</Title>
      <Form>
        <Input
          value={input}
          error={error}
          onChangeText= {text=> setInput(text)}
          autoCapitalize="none"
          autCorrect={false}
          placeholder="Procurar repositório ... "
        />
        <Submit onPress={() => {handleAddRepository();}}>
          <Icon name="add" size={22} color="#FFF" />
        </Submit>
      </Form>
      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        renderItem={({item}) => <Repository data={item} onRefresh= {() => handleRefreshRepository(item)} />}
      />
    </Container>
  );
}
