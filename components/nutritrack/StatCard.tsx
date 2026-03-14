import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { theme } from '../../libs/theme'
import { useThemeStore } from '../../stores/nutritrack'

interface StatCardProps {
  icon: keyof typeof MaterialIcons.glyphMap
  iconColor: string
  value: string | number
  label: string
  onPress?: () => void
}

export function StatCard({ icon, iconColor, value, label, onPress }: StatCardProps) {
  const { isDark } = useThemeStore()
  
  const bgColor = isDark ? theme.colors.slate800 : theme.colors.white
  const borderColor = isDark ? theme.colors.slate700 : theme.colors.slate100
  const textColor = isDark ? theme.colors.slate100 : theme.colors.slate900

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bgColor, borderColor },
        pressed && { opacity: 0.8 }
      ]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={24} color={iconColor} style={{ marginBottom: 4 }} />
      <Text style={[styles.val, { color: textColor }]}>{value}</Text>
      <Text style={styles.lbl}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 12,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  val: {
    fontSize: 14,
    fontFamily: 'PublicSans_700Bold',
  },
  lbl: {
    fontSize: 10,
    marginTop: 2,
    color: theme.colors.slate500,
  }
})
