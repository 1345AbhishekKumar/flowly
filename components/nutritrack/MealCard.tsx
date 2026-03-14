import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { theme } from '../../libs/theme'
import { useThemeStore, FoodEntry } from '../../stores/nutritrack'

interface MealCardProps {
  mealName: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  icon: string
  time?: string
  entries: FoodEntry[]
  onAddPress: () => void
  onItemPress: (entry: FoodEntry) => void
  disabled?: boolean
}

const MealStyles = {
  Breakfast: { bg: 'rgba(45,212,191,0.12)', text: '#0d9488' },
  Lunch: { bg: 'rgba(148,163,184,0.15)', text: '#64748b' },
  Dinner: { bg: 'rgba(236,91,19,0.12)', text: '#c04c0f' },
  Snack: { bg: 'rgba(251,146,60,0.15)', text: '#ea580c' },
}

export function MealCard({ mealName, icon, time, entries, onAddPress, onItemPress, disabled }: MealCardProps) {
  const { isDark } = useThemeStore()
  
  const bgColor = isDark ? theme.colors.slate800 : theme.colors.white
  const borderColor = isDark ? theme.colors.slate700 : theme.colors.slate100
  const textColor = isDark ? theme.colors.slate100 : theme.colors.slate900

  const totalCals = entries.reduce((sum, item) => sum + item.calories, 0)
  const isEmpty = entries.length === 0

  return (
    <View style={[
      styles.card, 
      { backgroundColor: bgColor, borderColor },
      disabled && { opacity: 0.7 }
    ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.iconTxt}>{icon}</Text>
            <Text style={styles.title}>{mealName}</Text>
          </View>
          
          <View style={styles.row}>
            {time && <Text style={styles.timeTxt}>{time}</Text>}
            {!isEmpty && (
              <View style={[styles.pill, { backgroundColor: MealStyles[mealName].bg }]}>
                <Text style={[styles.pillTxt, { color: MealStyles[mealName].text }]}>
                  {totalCals} kcal
                </Text>
              </View>
            )}
            {isEmpty && <Text style={styles.italicTxt}>Not logged</Text>}
          </View>
        </View>

        {!isEmpty && (
          <View style={styles.list}>
            {entries.map((entry) => (
              <Pressable 
                key={entry.id} 
                style={styles.itemRow}
                onPress={() => onItemPress(entry)}
              >
                <View style={styles.row}>
                  <Text style={styles.iconTxt}>{entry.emoji}</Text>
                  <Text style={[styles.itemName, { color: textColor }]}>{entry.name}</Text>
                </View>
                <Text style={styles.itemCals}>{entry.calories} kcal</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {!isEmpty ? (
        <Pressable 
          style={({pressed}) => [
            styles.addBtnSmall,
            { borderTopColor: isDark ? theme.colors.slate700 : theme.colors.slate200 },
            pressed && { backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : theme.colors.slate50 }
          ]}
          onPress={onAddPress}
        >
          <MaterialIcons name="add-circle" size={16} color={theme.colors.primary} />
          <Text style={styles.btnTxtSmall}>Add item to {mealName}</Text>
        </Pressable>
      ) : (
        <Pressable 
          style={({pressed}) => [
            styles.addBtnLarge,
            { backgroundColor: isDark ? 'rgba(51,65,85,0.5)' : theme.colors.slate50, borderColor },
            pressed && { opacity: 0.8 }
          ]}
          onPress={onAddPress}
        >
          <MaterialIcons name="add-circle" size={18} color={theme.colors.primary} />
          <Text style={styles.btnTxtLarge}>{time ? `Add ${mealName}` : `Log ${mealName}`}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...theme.shadows.sm,
    marginBottom: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconTxt: {
    fontSize: 16,
  },
  title: {
    fontSize: 12,
    fontFamily: 'PublicSans_700Bold',
    color: theme.colors.slate400,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  timeTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    color: theme.colors.slate400,
  },
  italicTxt: {
    fontSize: 12,
    fontFamily: 'PublicSans_400Regular',
    fontStyle: 'italic',
    color: theme.colors.slate400,
  },
  pill: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  pillTxt: {
    fontSize: 11,
    fontFamily: 'PublicSans_600SemiBold',
  },
  list: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'PublicSans_400Regular',
  },
  itemCals: {
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
    color: theme.colors.slate500,
  },
  addBtnSmall: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  btnTxtSmall: {
    fontSize: 12,
    fontFamily: 'PublicSans_600SemiBold',
    color: theme.colors.slate500,
  },
  addBtnLarge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  btnTxtLarge: {
    fontSize: 14,
    fontFamily: 'PublicSans_600SemiBold',
  }
})
