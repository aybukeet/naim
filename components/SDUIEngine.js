import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SDUIEngine({ layout }) {
  if (!layout || !layout.elements) return null;

  return (
    <View style={[{ flex: 1, padding: 20, justifyContent: 'center' }, { backgroundColor: layout.backgroundColor || '#fff' }]}>
      {layout.elements.map((element) => {
        // Metin ise Text componenti çiz
        if (element.type === 'text') {
          return (
            <Text key={element.id} style={element.style}>
              {element.content}
            </Text>
          );
        } 
        
        // Buton ise TouchableOpacity çiz
        else if (element.type === 'button') {
          return (
            <TouchableOpacity 
              key={element.id} 
              style={element.style}
              onPress={() => alert(`Sistem Eylemi Tetiklendi: ${element.action}`)}
            >
              <Text style={element.textStyle || { color: '#000', textAlign: 'center' }}>
                {element.content}
              </Text>
            </TouchableOpacity>
          );
        }
        
        return null; // Bilinmeyen element türü ise atla
      })}
    </View>
  );
}
