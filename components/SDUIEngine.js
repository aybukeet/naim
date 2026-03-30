import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function SDUIEngine({ layout, onAction }) {
  if (!layout || !layout.elements) return null;

  // Özyinelemeli (Recursive) JSON Parser: 
  // Container içindeki child elementleri de render eder.
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
                onAction(element.action);
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
        return null; // Bilinmeyen elementleri güvenli atlar
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
