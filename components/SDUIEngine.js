import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';

export default function SDUIEngine({ layout, onAction, initialState = {} }) {
  // Kullanıcının anket ve text formlarındaki değerlerini tuttuğumuz yer.
  const [formData, setFormData] = useState(initialState);

  // Dışarıdan yeni initialState (storage yüklenince) gelince senkronize ediyoruz
  useEffect(() => {
    setFormData(initialState);
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
              // Butona basıldığında, o ana kadar toplanan form verilerini de App.js'e yolla
              if (element.action) {
                onAction(element.action, formData);
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
