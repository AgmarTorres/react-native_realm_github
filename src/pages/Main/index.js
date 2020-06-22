import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Container, Title, Form, Input, Submit } from './styles'

export default function componentName() {
  return (
    <Container >
      <Title>Repositórios</Title>
      <Form>
        <Input 
        autoCapitalize = "none"
        autCorrect = { false }
         paceholder =  "Procurar repositório ... "
        />
        <Submit  onPress={() =>{

        }}>
          <Icon name="add" size={22} color="#FFF"/>
        </Submit>
      </Form>
     </Container>
  );
}
