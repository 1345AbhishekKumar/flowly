import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../../libs/theme'
import { useThemeStore } from '../../stores/nutritrack'

export function MacroPill({ color, label, position }: { color: string, label: string, position: object }) {
  const { isDark } = useThemeStore()
  
  return (
    <View style={[
      styles.pill, 
      { 
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
        borderColor: isDark ? theme.colors.slate700 : theme.colors.slate100 
      },
      position
    ]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color: isDark ? theme.colors.slate100 : theme.colors.slate900 }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'PublicSans_600SemiBold',
  }
})
