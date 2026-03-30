import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

export default function SDUIEngine({ layout, onAction, initialState = {} }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    // Profil datasından initial state gelirse form data içerisine aktarıyoruz (ilk açılışta)
    // Sadece chat_input boş değilken (manuel yazarken) silinmemesi için merge ediyoruz
    setFormData(prev => ({ ...initialState, ...prev }));
  }, [initialState]);

  if (!layout || !layout.elements) return null;

  const renderElement = (element, index) => {
    switch(element.type) {
      case 'text':
        return (
          <Text key={element.id || index} style={element.style}>
            {element.content}
          </Text>
        );

      case 'textInput':
        return (
          <TextInput 
            key={element.id || index}
            style={element.style}
            placeholder={element.placeholder}
            placeholderTextColor={element.placeholderTextColor || "#888"}
            multiline={element.multiline}
            value={formData[element.id] || ''}
            onChangeText={(text) => {
              if (element.id) {
                setFormData(prev => ({ ...prev, [element.id]: text }));
              }
            }}
          />
        );

      case 'container':
        return (
          <View key={element.id || index} style={element.style}>
             {element.children && element.children.map((child, i) => renderElement(child, i))}
          </View>
        );

      case 'button':
        return (
          <TouchableOpacity 
            key={element.id || index} 
            style={element.style}
            activeOpacity={0.8}
            onPress={() => {
              if (element.action) {
                onAction(element.action, formData);
                
                // Eğer sohbet mesajı atıldıysa (action type: SEND_MESSAGE), inputu anında temizle
                if (element.action.type === 'SEND_MESSAGE') {
                   setFormData(prev => ({...prev, chat_input: ''}));
                }
              }
            }}
          >
            {element.textStyle ? (
               <Text style={element.textStyle}>{element.content}</Text>
            ) : null}
            {element.children && element.children.map((child, i) => renderElement(child, i))}
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: layout.style?.backgroundColor || '#fff' }} 
      contentContainerStyle={[{ padding: 20, paddingBottom: 50, flexGrow: 1 }, layout.style]}
    >
      {layout.elements.map((el, i) => renderElement(el, i))}
    </ScrollView>
  );
}
