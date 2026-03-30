import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SDUIEngine({ layout, onAction }) {
  if (!layout || !layout.elements) return null;

  return (
    <View style={[{ flex: 1, padding: 20, justifyContent: 'center' }, { backgroundColor: layout.backgroundColor || '#fff' }]}>
      {layout.elements.map((element) => {
        
        if (element.type === 'text') {
          return (
            <Text key={element.id} style={element.style}>
              {element.content}
            </Text>
          );
        } 
        
        else if (element.type === 'button') {
          return (
            <TouchableOpacity 
              key={element.id} 
              style={element.style}
              onPress={() => {
                if (element.action) {
                  onAction(element.action); // App.js'e bildir
                }
              }}
            >
              <Text style={element.textStyle || { color: '#000', textAlign: 'center' }}>
                {element.content}
              </Text>
            </TouchableOpacity>
          );
        }
        
        return null;
      })}
    </View>
  );
}
